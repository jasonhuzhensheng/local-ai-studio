import {listVideos,readVideo,submitVideo,startVideo,stopVideo,deleteVideo,videoModels,videoBusy,videoDir} from './video_jobs.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { root, models, references, jobDir, uuidPattern } from './image_paths.mjs';
import {upscaleModel} from './image_upscale.mjs';
import { saveReference, submitImage } from './image_submit.mjs';
import { readJob, listJobs, deleteJob, startNext } from './image_jobs.mjs';
import {viggleReady,viggleV021Ready} from './viggle_model.mjs';
import { retryReadSync } from './fs_read_retry.mjs';
import {readChatStream} from './local_chat_stream.mjs';
export { readJob };

const assetCache=new Map();let assetCacheBytes=0;
function readAsset(file){
  const cached=assetCache.get(file);if(cached){assetCache.delete(file);assetCache.set(file,cached);return cached;}
  const data=retryReadSync(()=>fs.readFileSync(file));if(data.length>16*1024*1024)return data;
  while(assetCacheBytes+data.length>64*1024*1024){const [oldest,buffer]=assetCache.entries().next().value;assetCache.delete(oldest);assetCacheBytes-=buffer.length;}
  assetCache.set(file,data);assetCacheBytes+=data.length;return data;
}

function privateIPv4Addresses() {
  const addresses = new Set();
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family !== 'IPv4' || entry.internal) continue;
      const octets = entry.address.split('.').map(Number);
      const privateAddress = octets[0] === 10 ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168) ||
        (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127);
      if (privateAddress) addresses.add(entry.address);
    }
  }
  return addresses;
}
function allowedHost(host, port) {
  const normalized = String(host ?? '').toLowerCase();
  if (normalized === `127.0.0.1:${port}` || normalized === `localhost:${port}` || normalized === `[::1]:${port}`) return true;
  return [...privateIPv4Addresses()].some(address => normalized === `${address}:${port}`);
}

export function createGallery({port=1235, schedule=true, chatBaseUrl='http://127.0.0.1:1234/v1', chatTimeoutMs=1200000}={}) {
  const chatTasks=new Map();let activeChat=0;
  const localVideo=req=>['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
  const taskView=t=>({id:t.id,status:t.status,text:t.text,reasoning:t.reasoning,error:t.error,startedAt:t.startedAt});
  const json = (res, body, status=200) => {res.writeHead(status, {'Content-Type':'application/json'});res.end(JSON.stringify(body));};
  const server = http.createServer(async (req,res) => {
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    if(!allowedHost(req.headers.host,port)){res.writeHead(403).end();return;}
    const requestOrigin = `http://${req.headers.host}`;
    const url = new URL(req.url, requestOrigin);
    try {
      if((url.pathname.startsWith('/api/video')||url.pathname.startsWith('/videos/'))&&!localVideo(req))return json(res,{error:'视频功能仅允许本机访问'},403);
      if(req.method==='POST') {
        if(req.headers.origin!==requestOrigin||req.headers['content-type']!=='application/json'){res.writeHead(403).end();return;}
        const chunks=[];let size=0;
        for await(const chunk of req){size+=chunk.length;if(size>16000000)throw Error('上传过大');chunks.push(chunk);}
        const body=JSON.parse(Buffer.concat(chunks).toString());
        if(url.pathname==='/api/video-jobs')return json(res,submitVideo(body),202);
        const videoStop=url.pathname.match(/^\/api\/video-jobs\/([^/]+)\/stop$/);
        if(videoStop)return json(res,stopVideo(videoStop[1]));
        const videoDelete=url.pathname.match(/^\/api\/video-jobs\/([^/]+)\/delete$/);
        if(videoDelete)return json(res,deleteVideo(videoDelete[1]));
        if(url.pathname==='/api/references') return json(res,{id:saveReference(body.data)});
        const chatStop=url.pathname.match(/^\/api\/chat-tasks\/([a-f0-9-]+)\/stop$/);
        if(chatStop){const task=chatTasks.get(chatStop[1]);if(!task)return json(res,{error:'找不到文字任务'},404);task.controller.abort();return json(res,taskView(task));}
        if(url.pathname==='/api/chat') {
          if(videoBusy())return json(res,{error:'视频正在占用统一内存，请等待视频完成后再发送文字'},409);
          if(!Array.isArray(body.messages)||body.messages.length<1||body.messages.length>100)throw Error('对话记录无效');
          const responseMode=body.responseMode??'standard';
          let maxTokens={fast:1024,standard:4096,detailed:8192,maximum:32768}[responseMode];
          if(!maxTokens)throw Error('回答长度设置无效');
          const allMessages=body.messages.map(m=>{
            const limit=m?.role==='user'?6000:50000;
            if(!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>limit)throw Error('用户消息限6000字；助手历史单条限50000字');
            return {role:m.role,content:m.content};
          });
          let historyChars=0;const messages=[];
          for(let i=allMessages.length-1;i>=0&&messages.length<24;i--){const m=allMessages[i];if(historyChars+m.content.length>24000&&messages.length)break;historyChars+=m.content.length;messages.unshift(m);}
          messages.unshift({role:'system',content:'请始终使用简体中文回答，不要附加英文翻译或中英双语对照。仅当用户明确要求英文或翻译时，才提供相应英文内容。'});
          if(responseMode==='maximum'){
            messages[0].content+=' 用户选择极限详细回答：请充分展开必要的解释、步骤和例子，直接开始正文，避免无意义重复；若内容已完整则自然结束。';
            // UTF-8 bytes conservatively bound token usage, including non-Chinese input.
            let inputBudget=messages.reduce((sum,m)=>sum+Buffer.byteLength(m.content,'utf8')+32,0);
            while(inputBudget>24576&&messages.length>2){messages.splice(1,1);inputBudget=messages.reduce((sum,m)=>sum+Buffer.byteLength(m.content,'utf8')+32,0);}
            maxTokens=Math.max(1024,32768-inputBudget-1024);
          }
          if(body.background===true){
            if(typeof body.taskId!=='string'||!uuidPattern.test(body.taskId))throw Error('文字任务编号无效');
            if(chatTasks.has(body.taskId))return json(res,taskView(chatTasks.get(body.taskId)));
            for(const [id,t] of chatTasks)if(t.status!=='running'&&Date.now()-t.startedAt>86400000)chatTasks.delete(id);
            if(chatTasks.size>=100)throw Error('后台文字任务过多，请稍后再试');
            const controller=new AbortController();
            const task={id:body.taskId,status:'running',text:'',reasoning:false,startedAt:Date.now(),controller};
            chatTasks.set(task.id,task);
            activeChat++;
            void(async()=>{
              try{
                const upstream=await fetch(`${chatBaseUrl.replace(/\/$/,'')}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'qwen3.8-27b-local',messages,temperature:0.7,max_tokens:maxTokens,stream:true,...(body.thinking===false?{chat_template_kwargs:{enable_thinking:false},reasoning_effort:'none'}:{})}),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(chatTimeoutMs)])});
                if(!upstream.ok)throw Error(`LM Studio 返回 ${upstream.status}`);
                task.text=await readChatStream(upstream,{onText:text=>{task.text=text;},onReasoning:()=>{task.reasoning=true;}});
                task.status='completed';
              }catch(error){task.status=controller.signal.aborted?'stopped':'failed';task.error=controller.signal.aborted?null:error.message;}
              finally{activeChat--;}
            })();
            return json(res,taskView(task),202);
          }
          activeChat++;try{
          const cancelUpstream=new AbortController();
          req.once('aborted',()=>cancelUpstream.abort());
          res.once('close',()=>{if(!res.writableEnded)cancelUpstream.abort();});
          const signal=AbortSignal.any([cancelUpstream.signal,AbortSignal.timeout(chatTimeoutMs)]);
          const upstream=await fetch(`${chatBaseUrl.replace(/\/$/,'')}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'qwen3.8-27b-local',messages,temperature:0.7,max_tokens:maxTokens,stream:true,...(body.thinking===false?{chat_template_kwargs:{enable_thinking:false},reasoning_effort:'none'}:{})}),signal});
          if(!upstream.ok){const detail=(await upstream.text()).slice(0,1200);return json(res,{error:`LM Studio 返回 ${upstream.status}: ${detail}`},502);}
          if(!upstream.body)throw Error('LM Studio 没有返回生成内容');
          res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache','Connection':'keep-alive'});
          for await(const chunk of upstream.body){if(res.destroyed)break;res.write(chunk);}
          if(!res.destroyed)res.end();
          return;
          }finally{activeChat--;}
        }
        if(url.pathname==='/api/jobs'||url.pathname==='/api/edit') {
          if(url.pathname==='/api/edit' && !(body.reference_id||body.reference_ids?.length)) throw Error('请选择参考图');
          return json(res,submitImage(body));
        }
        const remove=url.pathname.match(/^\/api\/jobs\/([^/]+)\/delete$/);
        if(remove) return json(res,deleteJob(remove[1]));
        res.writeHead(404).end();return;
      }
      if(req.method!=='GET'){res.writeHead(405).end();return;}
      if(url.pathname==='/'||url.pathname==='/edit'||/^\/jobs\/[a-f0-9-]+$/.test(url.pathname)) {
        res.setHeader('Content-Type','text/html; charset=utf-8');
        res.end(retryReadSync(()=>fs.readFileSync(path.join(root,'src/image_editor.html'))));return;
      }
      if(url.pathname==='/video') {res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(path.join(root,'src/video_editor.html')));return;}
      if(url.pathname==='/video_settings.mjs'){res.setHeader('Content-Type','text/javascript; charset=utf-8');res.end(fs.readFileSync(path.join(root,'src/video_settings.mjs')));return;}
      if(url.pathname==='/video.js') {res.setHeader('Content-Type','text/javascript; charset=utf-8');res.end(fs.readFileSync(path.join(root,'src/video_editor.js')));return;}
      if(url.pathname==='/api/video-jobs')return json(res,{jobs:listVideos(),busy:videoBusy(),models:videoModels()});
      const videoTask=url.pathname.match(/^\/api\/video-jobs\/([^/]+)$/);if(videoTask)return json(res,readVideo(videoTask[1]));
      const videoFile=url.pathname.match(/^\/videos\/([^/]+)\.mp4$/);
      if(videoFile){const job=readVideo(videoFile[1]);if(job.status!=='completed')return json(res,{error:'视频尚未完成'},404);const file=path.join(videoDir(job.id),'video.mp4'),size=fs.statSync(file).size;res.setHeader('Content-Type','video/mp4');res.setHeader('Accept-Ranges','bytes');if(url.searchParams.has('download'))res.setHeader('Content-Disposition',`attachment; filename="minimax-${job.id}.mp4"`);const range=req.headers.range;let start=0,end=size-1;if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}if(!m[1])start=Math.max(0,size-Number(m[2]));else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}if(start> end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);}res.setHeader('Content-Length',end-start+1);const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);return;}
      if(url.pathname==='/chat') {res.setHeader('Content-Type','text/html; charset=utf-8');res.end(retryReadSync(()=>fs.readFileSync(path.join(root,'src/local_chat.html'))));return;}
      if(url.pathname==='/chat.js') {res.setHeader('Content-Type','text/javascript; charset=utf-8');res.end(retryReadSync(()=>fs.readFileSync(path.join(root,'src/local_chat.js'))));return;}
      if(url.pathname==='/chat_stream.mjs') {res.setHeader('Content-Type','text/javascript; charset=utf-8');res.end(retryReadSync(()=>fs.readFileSync(path.join(root,'src/local_chat_stream.mjs'))));return;}
      if(url.pathname==='/studio.js') {res.setHeader('Content-Type','text/javascript');res.end(retryReadSync(()=>fs.readFileSync(path.join(root,'src/image_editor.js'))));return;}
      if(url.pathname==='/image_dimensions.mjs') {res.setHeader('Content-Type','text/javascript');res.end(retryReadSync(()=>fs.readFileSync(path.join(root,'src/image_dimensions.mjs'))));return;}
      if(url.pathname==='/api/models') return json(res,{detailReady:fs.existsSync(upscaleModel),waiReady:fs.existsSync(path.join(models,'waiIllustriousSDXL_v170.safetensors')),viggleReady:viggleReady(),viggleV021Ready:viggleV021Ready()});
      const chatTask=url.pathname.match(/^\/api\/chat-tasks\/([a-f0-9-]+)$/);
      if(chatTask){const task=chatTasks.get(chatTask[1]);return task?json(res,taskView(task)):json(res,{error:'文字任务不存在或服务已重启'},404);}
      if(url.pathname==='/api/jobs') return json(res,{jobs:listJobs()});
      const api=url.pathname.match(/^\/api\/jobs\/([^/]+)$/);
      if(api) return json(res,readJob(api[1]));
      const img=url.pathname.match(/^\/(images|references|base-images)\/([^/]+)\.png$/);
      if(img&&uuidPattern.test(img[2])) {
        const file=img[1]==='base-images'?path.join(jobDir(img[2]),'base.png'):img[1]==='images'?path.join(jobDir(img[2]),'image.png'):path.join(references,img[2]+'.png');
        res.setHeader('Content-Type','image/png');res.end(readAsset(file));return;
      }
      res.writeHead(404).end('Not found');
    } catch(e) {
      if(res.destroyed)return;
      if(res.headersSent){
        if(!res.destroyed&&!res.writableEnded){
          if(res.getHeader('Content-Type')?.toString().startsWith('text/event-stream'))res.write(`data: ${JSON.stringify({error:{message:e.message}})}\n\n`);
          res.end();
        }
        return;
      }
      if(e.code!=='ENOENT')console.error(`Gallery ${req.method} ${url.pathname}: ${e.code||'ERROR'} ${e.message}`);
      json(res,{error:req.method==='POST'?e.message:e.code==='ENOENT'?'找不到任务或图片':'本地读取失败，请稍后重试'},req.method==='POST'?400:e.code==='ENOENT'?404:500);
    }
  });
  let timer;
  server.on('listening',()=> {if(schedule) {const tick=()=>{try{const busy=videoBusy();if(!busy)startNext();startVideo({imagesBusy:listJobs().some(j=>['running','starting','queued'].includes(j.status)),chatBusy:activeChat>0});}catch(e){console.error('Queue:',e.message);}};tick();timer=setInterval(tick,1000);}});
  server.on('close',()=>clearInterval(timer));
  return server;
}
if(process.argv[1]===path.join(root,'src/image_gallery.mjs')) createGallery().listen(1235,'0.0.0.0');
