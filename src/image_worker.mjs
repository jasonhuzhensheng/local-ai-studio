import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { root, jobs, binary, models, jobDir } from './image_paths.mjs';
import {enhance8k} from './image_upscale.mjs';
import { parseGenerationLog, saveJob } from './image_jobs.mjs';
import { retryReadSync } from './fs_read_retry.mjs';
export { root, jobs, binary, models };

export function describeGenerationFailure(code, logTail = '') {
  if (logTail.includes('LOCAL_MODEL_NOT_RESIDENT')) {
    return '模型文件被macOS移出了本地，当前只剩占位记录。请先恢复模型文件再生成；任务尚未开始推理，降低分辨率或反复提交无法解决。';
  }
  if (/Errno 11.*Resource deadlock avoided/.test(logTail) &&
      (/Fatal Python error: init_import_site/.test(logTail) || /importlib\.metadata/.test(logTail))) {
    return 'Python启动时遇到macOS临时文件读取错误（Errno 11），已自动重试但仍失败；任务尚未开始推理。稍后可重新提交，详细日志已保留。';
  }
  if (/ggml_metal.*(?:failed|error state)|GPU error\/recovery/.test(logTail)) {
    const stage = /failed to encode prompt|LLM prompt encoding failed/.test(logTail) ? '参考图或提示词编码' : '图片计算';
    return `Metal GPU在${stage}阶段执行失败。未生成图片；可尝试较低分辨率。详细日志已保留。`;
  }
  if (/out of memory|failed to allocate|not enough memory/i.test(logTail)) {
    return '生成时内存分配失败。请降低分辨率或减少参考图后重试；详细日志已保留。';
  }
  return `绘图进程退出（${code ?? '被信号终止'}），请检查生成日志。`;
}

export function generationFailureMessage(error, logTail) {
  return /LOCAL_MODEL_NOT_RESIDENT|Metal|ggml_metal|out of memory|failed to allocate|Errno 11.*Resource deadlock avoided/i.test(logTail)
    ? describeGenerationFailure(null, logTail) : error.message;
}

export function imageArgs(job, output) {
  if(job.model_id?.startsWith('viggle-qwen-image-2.1-'))throw Error('Viggle 使用 Diffusers 专用 worker');
  if(job.model_id && !['qwen-image-2.1','wai-illustrious-v17'].includes(job.model_id))throw Error('不支持的模型');
  if(job.model_id==='wai-illustrious-v17'){
    if(job.referenceImages?.length || job.referenceImage)throw Error('WAI 不支持此参考图编辑流程');
    return ['-m',path.join(models,'waiIllustriousSDXL_v170.safetensors'),
      '-p',job.prompt,'-n',job.negative_prompt||'', '-W',String(job.width),'-H',String(job.height),
      '--steps',String(job.steps),'--seed',String(job.seed),'--cfg-scale','6',
      '--sampling-method','euler_a','--scheduler','discrete','-o',output,
      ...(job.width*job.height>1048576?['--vae-tiling']:[])];
  }

  if (job.cache_mode && !['none', 'easycache', 'spectrum'].includes(job.cache_mode)) throw Error('不支持的缓存模式');
  if (![1,6].includes(job.cfg_scale ?? 6)) throw Error('不支持的CFG模式');
  if (job.vae_tile_size !== undefined && ![32,48,64].includes(job.vae_tile_size)) throw Error("不支持的解码分块");
  if(job.reference_max_pixels !== undefined && ![786432,1048576].includes(job.reference_max_pixels))throw Error('不支持的参考编码像素上限');
  if(job.qwen_optimization&&!['baseline','resident','vae_direct'].includes(job.qwen_optimization))throw Error('不支持的Qwen计算方案');
  if(job.cache_threshold!==undefined&&(job.cache_mode!=='easycache'||![0.2,0.3,0.4].includes(job.cache_threshold)))throw Error('不支持的缓存强度');
  const refs = job.referenceImages || (job.referenceImage ? [job.referenceImage] : []);
  return ['--diffusion-model', path.join(models, 'qwen_image_2.1-Q4_K.gguf'),
    '--llm', path.join(models, 'Qwen3VL-8B-Instruct-Q4_K_M.gguf'),
    '--vae', path.join(models, 'qwen_image_2.1_vae_bf16.safetensors'),
    '-p', job.prompt, '-W', String(job.width), '-H', String(job.height),
    '--steps', String(job.steps), '--seed', String(job.seed),
    '--cfg-scale', String(job.cfg_scale ?? 6), '--sampling-method', 'euler', ...(job.qwen_optimization==='resident'?[]:['--offload-to-cpu']), '-o', output,
    ...(job.qwen_optimization==='vae_direct'?['--vae-conv-direct']:[]),
    ...(job.width * job.height > 1048576 ? ['--diffusion-fa', '--vae-tiling', ...(job.vae_tile_size ? ['--vae-tile-size', `${job.vae_tile_size}x${job.vae_tile_size}`] : [])] : []),
    ...(job.cache_mode && job.cache_mode !== 'none' ? ['--cache-mode', job.cache_mode] : []),
    ...(job.cache_threshold!==undefined?['--cache-option',`threshold=${job.cache_threshold}`]:[]),
    ...(job.negative_prompt && job.cfg_scale !== 1 ? ['-n', job.negative_prompt] : []),
    // Qwen 2.1 otherwise upscales each reference to the output pixel area,
    // including its vision encoder input. Keep both reference encodings aligned
    // at a bounded size without changing the requested output resolution.
    ...(refs.length ? ['--ref-image-args', `vae_input_max_pixels=${job.reference_max_pixels ?? 1048576}`,
      '--llm_vision', path.join(models,'mmproj-Qwen3VL-8B-Instruct-F16.gguf'), ...refs.flatMap(ref => ['-r', ref])] : [])];
}

export function childEnvironment(job, base = process.env) {
  const env={...base};
  if(process.platform==='darwin'&&job.model_id?.startsWith('viggle-qwen-image-2.1-'))
    env.PYTHONPYCACHEPREFIX=base.PYTHONPYCACHEPREFIX||path.join(os.homedir(),'Library','Application Support','LocalImageStudio','python-cache');
  if(job.model_id==='qwen-image-2.1'&&job.large_mode==='faster'&&job.width*job.height>1048576)
    env.SD_QWEN_DECODE_TILE_SIZE='48';
  return env;
}

export async function runWorker(id, command = binary, makeArgs = imageArgs) {
  const dir=jobDir(id), job=JSON.parse(fs.readFileSync(path.join(dir,'status.json'),'utf8'));
  const lock=path.join(jobs,'active.lock');
  if(fs.existsSync(path.join(dir,'delete.request'))){fs.rmSync(dir,{recursive:true,force:true});fs.rmSync(lock,{recursive:true,force:true});return;}
  const log=fs.openSync(path.join(dir,'generation.log'),'a'),output=path.join(dir,'image.png');
  let child, stopping=false,forceKill;
  const save=()=>saveJob(job);
  const stop=()=>{if(stopping)return;stopping=true;if(child){child.kill('SIGTERM');forceKill=setTimeout(()=>child?.kill('SIGKILL'),10000);}};
  const watch=setInterval(()=>{if(fs.existsSync(path.join(dir,'delete.request')))stop();},500);
  process.once('SIGTERM',stop);process.once('SIGINT',stop);
  const run=(executable,args,env=process.env)=>new Promise((resolve,reject)=>{
    if(stopping)return reject(Error('任务已停止'));
    // A dataless executable can block posix_spawn before Node receives a PID.
    // Start the resident system shell first; exec preserves its PID and keeps
    // our cancellation watcher responsive while the target is materialized.
    // Arguments remain positional data, never interpolated into shell code.
    child=process.platform==='darwin'
      ?spawn('/bin/sh',['-c','exec "$@"','local-image-child',executable,...args],{stdio:['ignore',log,log],env})
      :spawn(executable,args,{stdio:['ignore',log,log],env});
    job.generationPid=child.pid;save();
    child.once('error',reject);
    child.once('close',code=>{child=undefined;clearTimeout(forceKill);if(code===0&&!stopping)resolve();else reject(Error(`绘图进程退出（${code ?? '被信号终止'}）`));});
  });
  const runViggle=async(args,env)=>{
    const delays=[300,1000,2000];
    for(let attempt=0;;attempt++){
      const offset=retryReadSync(()=>fs.statSync(path.join(dir,'generation.log'))).size;
      try{return await run(path.join(root,'.local/viggle-env/bin/python3'),args,env);}
      catch(error){
        let recent='';
        try{const size=retryReadSync(()=>fs.statSync(path.join(dir,'generation.log'))).size,fd=retryReadSync(()=>fs.openSync(path.join(dir,'generation.log'),'r')),b=Buffer.alloc(Math.min(Math.max(0,size-offset),8192));try{if(b.length)retryReadSync(()=>fs.readSync(fd,b,0,b.length,offset));recent=b.toString();}finally{fs.closeSync(fd);}}catch{}
        const startupDeadlock=(/Fatal Python error: init_import_site/.test(recent)||/importlib\.metadata/.test(recent))&&/Errno 11.*Resource deadlock avoided/.test(recent);
        if(!startupDeadlock||attempt>=delays.length||stopping)throw error;
        const delay=delays[attempt];fs.writeSync(log,`\n[viggle] Python启动遇到临时文件读取错误，${delay}ms后自动重试（${attempt+1}/${delays.length}）\n`);
        await new Promise(resolve=>setTimeout(resolve,delay));
      }
    }
  };
  try{
    job.status='running';job.workerPid=process.pid;job.startedAt=new Date().toISOString();save();
    if(job.benchmark_server===true){
      await run(process.execPath,[path.join(root,'src/qwen_server_trial.mjs'),path.join(dir,'status.json'),output]);
    }else if(['dual_decode','resident_profile'].includes(job.native_trial)){
      await run(path.join(root,'.local/sd-native-profile/build/bin/sd-cli'),makeArgs(job,output),{
        ...process.env,SD_NATIVE_PROFILE:'1',SD_NATIVE_DECODE_COMPARE:job.native_trial==='dual_decode'?'1':'0'
      });
      if(job.native_trial==='dual_decode'){
        if(!fs.existsSync(path.join(dir,'image_1.png')))throw Error('第二组解码结果缺失');
        fs.copyFileSync(path.join(dir,'image_0.png'),output);
      }
    }else if(job.model_id?.startsWith('viggle-qwen-image-2.1-')){
      await runViggle([
        path.join(root,'src/viggle_worker.py'),path.join(dir,'status.json'),output
      ],childEnvironment(job));
    }else await run(command,makeArgs(job,output),childEnvironment(job));
    if(!fs.existsSync(output))throw Error('绘图进程没有生成图片');
    if(job.detail_mode==='8k'){
      const base=path.join(dir,'base.png');fs.renameSync(output,base);job.baseImage=base;save();
      const stage=value=>{job.enhanceStage=value;save();fs.writeSync(log,`\n[enhance] ${value}\n`);};
      const [width,height]=await enhance8k(base,output,run,stage,command);
      job.output_width=width;job.output_height=height;job.enhanceStage='8K增强完成';
    }
    job.status='completed';job.image=output;delete job.error;
  }catch(error){
    job.status='failed';let tail='';
    try{const fd=retryReadSync(()=>fs.openSync(path.join(dir,'generation.log'),'r'));try{const size=retryReadSync(()=>fs.fstatSync(fd)).size,b=Buffer.alloc(Math.min(size,16384));retryReadSync(()=>fs.readSync(fd,b,0,b.length,Math.max(0,size-b.length)));tail=b.toString();}finally{fs.closeSync(fd);}}catch{}
    job.error=generationFailureMessage(error,tail);
    if(job.baseImage)job.error+='；基础图已保留，可下载。';
  }finally{
    clearInterval(watch);clearTimeout(forceKill);process.removeListener('SIGTERM',stop);process.removeListener('SIGINT',stop);
    try{const reader=retryReadSync(()=>fs.openSync(path.join(dir,'generation.log'),'r'));try{const size=retryReadSync(()=>fs.fstatSync(reader)).size,b=Buffer.alloc(Math.min(size,8192));retryReadSync(()=>fs.readSync(reader,b,0,b.length,Math.max(0,size-b.length)));Object.assign(job,parseGenerationLog(b.toString(),job.enhanceStage));if(job.enhanceStage){job.stage=job.enhanceStage;delete job.progress;delete job.decodeProgress;}}finally{fs.closeSync(reader);}}catch{}
    job.finishedAt=new Date().toISOString();save();fs.closeSync(log);
    if(fs.existsSync(path.join(dir,'delete.request')))fs.rmSync(dir,{recursive:true,force:true});
    fs.rmSync(lock,{recursive:true,force:true});
  }
}
if (process.argv[2] === '--job') runWorker(process.argv[3]);
