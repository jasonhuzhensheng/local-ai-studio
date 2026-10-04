"""One local video job, isolated ComfyUI process, real WS progress and memory guards."""
import argparse,json,os,socket,subprocess,time,urllib.request,threading,shutil,signal
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--job-dir',required=True);parser.add_argument('--base',required=True);args=parser.parse_args()
directory=Path(args.job_dir);base=Path(args.base);status=directory/'status.json';job=json.loads(status.read_text());lock=threading.RLock();stop=threading.Event();process=None
signal.signal(signal.SIGTERM,lambda *_:stop.set())
signal.signal(signal.SIGINT,lambda *_:stop.set())
def update(**values):
 with lock:
  job.update(values);temp=status.with_suffix('.tmp-worker');temp.write_text(json.dumps(job,ensure_ascii=False,indent=2));temp.replace(status)
def api(route,data=None):
 req=urllib.request.Request('http://127.0.0.1:8191'+route,data=None if data is None else json.dumps(data).encode(),headers={'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=10) as response:return json.load(response)
def cancelled():return stop.is_set() or (directory/'stop.request').exists()
started=time.monotonic();peak=0;minimum=2**63;swap_peak=0;result={};error=None;cancel=False;restore_model=None
lms=Path.home()/".lmstudio/bin/lms"
def loaded_text():
 raw=subprocess.run([str(lms),"ps","--json"],capture_output=True,text=True,timeout=20,check=True).stdout
 return next((m for m in json.loads(raw[raw.index("["):]) if m.get("identifier")=="qwen3.8-27b-local"),None)
try:
 import psutil,aiohttp,av,asyncio,queue
 from video_memory import startup_memory
 class ProgressSocket:
  def __init__(self,url):
   self.messages=queue.Queue();self.ready=threading.Event();self.closed=threading.Event()
   async def receive():
    try:
     async with aiohttp.ClientSession() as session:
      async with session.ws_connect(url,heartbeat=15) as socket:
       self.ready.set()
       async for message in socket:
        if self.closed.is_set():break
        if message.type==aiohttp.WSMsgType.TEXT:self.messages.put(message.data)
    except Exception as exc:self.messages.put(exc);self.ready.set()
   threading.Thread(target=lambda:asyncio.run(receive()),daemon=True).start()
   if not self.ready.wait(15):raise RuntimeError("视频进度连接超时")
  def recv(self):
   value=self.messages.get(timeout=1)
   if isinstance(value,Exception):raise value
   return value
  def close(self):self.closed.set()
 update(workerPid=os.getpid(),stage='检查内存与视频模型')
 if job['width']%32 or job['height']%32 or (job['frames']-5)%17 or (job['width']*job['height']*job['frames']>12000000 and (job['width'],job['height'],job['frames'],bool(job.get('audio')))!=(1280,736,22,False)):raise RuntimeError('视频任务尺寸、帧数或负载不符合保护限制')
 if job.get('audio') and (job['width'],job['height'],job['frames']) not in [(256,256,22),(512,864,22)]:raise RuntimeError('音频组合未通过验证')
 if job.get('outputWidth') and (job['outputWidth']>job['width'] or job['outputHeight']>job['height'] or job['outputFrames']>job['frames']):raise RuntimeError('输出裁切参数无效')
 if not (base/'download-verified.json').is_file():raise RuntimeError('视频权重校验记录缺失')
 if cancelled():raise InterruptedError("任务已停止")
 with socket.socket() as probe:probe.bind(("127.0.0.1",8191))
 if (job.get('modelVariant')=='ref2va' or startup_memory(psutil.virtual_memory())['availableBytes']<56*2**30) and lms.is_file():
  model=loaded_text()
  if job.get('modelVariant')=='ref2va' and model and (model.get('status')!='idle' or model.get('queued')!=0):raise RuntimeError('文字模型正在处理请求，请等待空闲后再运行Ref2VA')
  if model and model.get("status")=="idle" and model.get("queued")==0:
   update(stage="临时卸载空闲文字模型，为视频释放内存")
   subprocess.run([str(lms),"unload","qwen3.8-27b-local"],capture_output=True,text=True,timeout=30,check=True)
   restore_model=model;update(textModelTemporarilyUnloaded=True)
   time.sleep(1)
 start_memory=startup_memory(psutil.virtual_memory())
 available_at_start=start_memory['availableBytes']
 update(startAvailableBytes=available_at_start,requiredAvailableBytes=56*2**30,startMemoryMeasurement=start_memory)
 if available_at_start<56*2**30:
  deficit=56*2**30-available_at_start
  raise RuntimeError(f'启动内存不足：实际可用{available_at_start/2**30:.2f}GiB（{available_at_start/10**9:.2f}GB），需要56GiB（60.13GB），还差{deficit/2**30:.2f}GiB。本任务未加载模型；释放内存后请重新提交。')
 swap=psutil.swap_memory().used
 if job.get('modelVariant')=='ref2va':update(cachePolicy='none')
 log=(directory/'server.log').open('w')
 process=subprocess.Popen([str(base/'venv/bin/python'),'main.py','--listen','127.0.0.1','--port','8191','--disable-api-nodes','--reserve-vram','20','--preview-method','none','--use-pytorch-cross-attention','--novram']+(['--cache-none'] if job.get('modelVariant')=='ref2va' else []),cwd=base/'ComfyUI',stdout=log,stderr=subprocess.STDOUT)
 update(serverPid=process.pid,status='running',stage='启动独立视频服务')
 def check():
  global peak,minimum,swap_peak
  if cancelled():raise InterruptedError('任务已停止')
  if process.poll() is not None:raise RuntimeError('视频服务退出，请查看保留的日志')
  available=psutil.virtual_memory().available;growth=max(0,psutil.swap_memory().used-swap);peak=max(peak,psutil.Process(process.pid).memory_info().rss);minimum=min(minimum,available);swap_peak=max(swap_peak,growth)
  update(elapsedSeconds=round(time.monotonic()-started,1),peakRssBytes=peak,minAvailableBytes=minimum,maxSwapGrowthBytes=swap_peak)
  if available<16*2**30 or growth>4*2**30:raise RuntimeError('内存保护触发：可用内存低于16GiB或新增交换超过4GiB。已停止本视频服务；可关闭其他应用后重试。')
 for _ in range(180):
  check()
  try:api('/system_stats');break
  except (OSError,TimeoutError):time.sleep(1)
 else:raise RuntimeError('视频服务启动超时')
 client=job['id'];ws=ProgressSocket('ws://127.0.0.1:8191/ws?clientId='+client)
 workflow=json.loads(Path(__file__).with_name('h3_smoke_api.json').read_text());workflow['4']['inputs']['prompt']=job['prompt'];workflow['4']['inputs'].update(width=job['width'],height=job['height'],length=job['frames']);workflow['7']['inputs']['seed']=job['seed'];workflow['10']['inputs']['filename_prefix']='web-video/'+client
 from video_references import apply_references
 apply_references(workflow,job,directory,base)
 workflow['7']['inputs'].update(steps=job.get('steps',4),sampler_name=job.get('sampler','euler'))
 if job.get('audio'):
  workflow['12']={'class_type':'VAELoader','inputs':{'vae_name':'minimax_h3_audio_vae_fp32.safetensors'}}
  workflow['13']={'class_type':'VAEDecodeAudio','inputs':{'samples':['7',0],'vae':['12',0]}}
  workflow['9']['inputs']['audio']=['13',0]
 if job.get('outputWidth'):
  workflow['14']={'class_type':'ImageCrop','inputs':{'image':['8',0],'width':job['outputWidth'],'height':job['outputHeight'],'x':(job['width']-job['outputWidth'])//2,'y':(job['height']-job['outputHeight'])//2}}
  workflow['15']={'class_type':'ImageFromBatch','inputs':{'image':['14',0],'batch_index':0,'length':job['outputFrames']}}
  workflow['9']['inputs']['images']=['15',0]
  if job.get('audio'):
   workflow['16']={'class_type':'TrimAudioDuration','inputs':{'audio':['13',0],'start_index':0.0,'duration':job['outputFrames']/24}}
   workflow['9']['inputs']['audio']=['16',0]
 (directory/'workflow.json').write_text(json.dumps(workflow,ensure_ascii=False,indent=2))
 response=api('/prompt',{'prompt':workflow,'client_id':client});prompt_id=response['prompt_id'];update(promptId=prompt_id,stage='加载模型与编码提示词')
 names={'1':'加载视频主模型','2':'加载文字编码器','3':'加载视频解码器','4':'编码提示词','11':'卸载编码器，释放内存','5':'准备条件','6':'准备采样模型','7':'视频采样','8':'解码视频帧','9':'合成视频','10':'保存MP4'}
 deadline=time.monotonic()+900;last_check=0;history=None
 while time.monotonic()<deadline:
  if time.monotonic()-last_check>=1:check();last_check=time.monotonic()
  try:
   message=ws.recv()
   if isinstance(message,str):
    event=json.loads(message);data=event.get('data',{})
    if data.get('prompt_id') not in (None,prompt_id):continue
    if event['type']=='executing':update(stage=names.get(str(data.get('node')),'检查视频输出'),node=data.get('node'))
    elif event['type']=='progress':update(progress={'step':data['value'],'total':data['max']})
    elif event['type']=='execution_error':raise RuntimeError('视频生成失败：'+str(data.get('exception_message','未知节点错误'))[:1200])
    elif event['type']=='execution_success':history=api('/history/'+prompt_id).get(prompt_id);break
  except queue.Empty:pass
  if int(time.monotonic()-started)%3==0:
   history=api('/history/'+prompt_id).get(prompt_id)
   if history:break
 if not history:raise RuntimeError('生成超过15分钟保护上限，已停止本任务')
 if history.get('status',{}).get('status_str')!='success':raise RuntimeError('视频工作流失败，请查看任务日志')
 (directory/'history.json').write_text(json.dumps(history,ensure_ascii=False,indent=2))
 ws.close()
 files=list((base/'ComfyUI/output/web-video').glob(client+'*.mp4'))
 if len(files)!=1:raise RuntimeError('未找到唯一视频输出')
 with av.open(str(files[0])) as video:
  frames=list(video.decode(video=0))
  if len(frames)!=job.get('outputFrames',job['frames']) or (frames[0].width,frames[0].height)!=(job.get('outputWidth',job['width']),job.get('outputHeight',job['height'])):raise RuntimeError('视频帧数或尺寸验证失败')
 metadata={}
 with av.open(str(files[0])) as media:
  metadata['streams']=[{'type':x.type,'codec':x.codec_context.name,'duration':float(x.duration*x.time_base) if x.duration else None,'sample_rate':x.codec_context.sample_rate if x.type=='audio' else None,'channels':x.codec_context.channels if x.type=='audio' else None} for x in media.streams]
 if job.get('audio'):
  import numpy as np
  with av.open(str(files[0])) as media:
   decoded=[x.to_ndarray() for x in media.decode(audio=0)]
   wave=np.concatenate(decoded,axis=-1);metadata['audio_rms']=float(np.sqrt(np.mean(wave**2)));metadata['audio_peak']=float(np.max(np.abs(wave)));metadata['audio_samples']=int(wave.shape[-1])
  if metadata['audio_rms']<1e-6:raise RuntimeError('Audio track is silent')
 (directory/'media-probe.json').write_text(json.dumps(metadata,indent=2))
 shutil.copy2(files[0],directory/'video.mp4');files[0].unlink()
 result={'videoUrl':'/videos/'+client+'.mp4','decodedFrames':len(frames),'bytes':(directory/'video.mp4').stat().st_size,'durationSeconds':len(frames)/24}
except InterruptedError as exc:error=str(exc);cancel=True
except Exception as exc:
 error='视频端口8191已被占用。本任务未连接或停止其他服务；待现有视频服务退出后重试。' if isinstance(exc,OSError) and exc.errno in (48,98) else str(exc)
finally:
 # Do not release the shared GPU slot until this exact child has exited.
 update(status='stopping',stage='释放视频模型内存')
 if process:
  process.terminate()
  try:process.wait(timeout=15)
  except subprocess.TimeoutExpired:process.kill();process.wait()
 for file in (base/'ComfyUI/input').glob(job['id']+'-*.png'):
  file.unlink(missing_ok=True)
 if restore_model:
  try:
   update(stage="视频模型已释放，恢复原文字模型")
   if not loaded_text():
    restored=subprocess.run([str(lms),'load',restore_model['modelKey'],'--identifier','qwen3.8-27b-local','--context-length',str(restore_model['contextLength']),'--parallel',str(restore_model['parallel']),'-y'],capture_output=True,text=True,timeout=180,check=True)
   update(textModelRestored=True)
  except Exception as exc:update(warning="视频任务已结束，但文字模型恢复失败。请在LM Studio重新加载qwen3.8-27b-local："+str(exc)[:300])
 update(status='cancelled' if cancel else 'failed' if error else 'completed',stage='已停止' if cancel else '生成失败' if error else '完成',error=error,finishedAt=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),elapsedSeconds=round(time.monotonic()-started,2),peakRssBytes=peak,minAvailableBytes=None if minimum==2**63 else minimum,maxSwapGrowthBytes=swap_peak,**result)
