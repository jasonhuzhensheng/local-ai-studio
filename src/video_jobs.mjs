import {resolveVideoSettings} from './video_settings.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {root,dataRoot,uuidPattern,references} from './image_paths.mjs';
const directory=path.join(dataRoot,'video-jobs');
const base=process.env.LOCAL_VIDEO_BASE||path.join(os.homedir(),'Library/Application Support/LocalImageStudio/video-experimental');
const active=new Set(['starting','running','stopping']);
function alive(pid){try{if(!Number.isInteger(pid)||pid<=0)return false;process.kill(pid,0);return true;}catch(e){return e.code!=='ESRCH';}}
export function videoDir(id){if(!uuidPattern.test(id))throw Error('视频任务编号无效');return path.join(directory,id);}
export function saveVideo(job){fs.mkdirSync(videoDir(job.id),{recursive:true});const file=path.join(videoDir(job.id),'status.json');fs.writeFileSync(file+'.tmp',JSON.stringify(job,null,2));fs.renameSync(file+'.tmp',file);}
export function readVideo(id){const job=JSON.parse(fs.readFileSync(path.join(videoDir(id),'status.json'),'utf8'));if(active.has(job.status)&&!alive(job.workerPid)&&!(job.status==='starting'&&Date.now()-Date.parse(job.startedAt)<15000)){
 if(alive(job.serverPid)){job.status='stopping';job.stage='管理进程退出，等待专属视频服务退出';}
 else{job.status='failed';job.error='视频进程已退出，请重新提交；日志已保留';job.finishedAt=new Date().toISOString();}saveVideo(job);
 }return job;}
export function listVideos(){fs.mkdirSync(directory,{recursive:true});return fs.readdirSync(directory).filter(id=>uuidPattern.test(id)).flatMap(id=>{try{return [readVideo(id)];}catch(e){if(e.code==='ENOENT')return [];throw e;}}).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function videoBusy(){return listVideos().some(j=>active.has(j.status));}
export function submitVideo(body){if(Object.keys(body).some(k=>!['prompt','requestId','preset','seed','ratio','resolution','frames','audio','firstFrame','lastFrame','modelVariant','referenceIds'].includes(k)))throw Error('包含不支持的视频参数；请使用比例、分辨率档位和帧数设置');if(typeof body.prompt!=='string'||!body.prompt.trim()||body.prompt.length>1500)throw Error('视频提示词需为1–1500字');if(!uuidPattern.test(body.requestId||''))throw Error('请求编号无效');
 const modelVariant=body.modelVariant??'fl2va';if(!['fl2va','ref2va'].includes(modelVariant))throw Error('视频模型无效');
 const referenceIds=body.referenceIds??[];if(!Array.isArray(referenceIds)||referenceIds.length>9)throw Error('Ref2VA最多9张参考图');
 if(modelVariant==='fl2va'&&referenceIds.length)throw Error('首尾帧模型不能使用多参考图');
 if(modelVariant==='ref2va'&&(body.firstFrame||body.lastFrame))throw Error('多参考模式不能混用首尾帧');
 for(const id of referenceIds)if(typeof id!=='string'||!uuidPattern.test(id)||!fs.existsSync(path.join(references,id+'.png')))throw Error('参考图无效，请重新选择图片');
 if(modelVariant==='ref2va'&&!fs.existsSync(path.join(base,'ref2va-verified.json')))throw Error('Ref2VA仍在下载或校验，完成后才能提交');
 const refs={};for(const role of ['firstFrame','lastFrame']){if(body[role]!==undefined&&body[role]!==null){if(typeof body[role]!=='string'||!uuidPattern.test(body[role])||!fs.existsSync(path.join(references,body[role]+'.png')))throw Error('参考图无效，请重新选择图片');refs[role]=body[role];}}
 const settings=resolveVideoSettings(body);
 const existing=listVideos().find(j=>j.id===body.requestId);if(existing){if((existing.modelVariant??'fl2va')!==modelVariant||JSON.stringify(existing.referenceIds??[])!==JSON.stringify(referenceIds)||existing.firstFrame!==refs.firstFrame||existing.lastFrame!==refs.lastFrame||existing.prompt!==body.prompt.trim()||existing.seed!==(body.seed??42)||existing.width!==settings.width||existing.height!==settings.height||existing.frames!==settings.frames||(existing.outputWidth||existing.width)!==settings.outputWidth||(existing.outputHeight||existing.height)!==settings.outputHeight||(existing.audio===true)!==settings.audio)throw Error('请求编号已用于其他参数');return existing;}
 if(body.preset!==undefined&&body.preset!=='smoke')throw Error('仅支持已验证的小样参数');
 const seed=body.seed??42;if(!Number.isInteger(seed)||seed<0||seed>2147483647)throw Error('种子需为0–2147483647的整数');
 if(!fs.existsSync(path.join(base,'download-verified.json')))throw Error('视频权重尚未完成校验');
 if(listVideos().filter(j=>j.status==='queued'||active.has(j.status)).length>=3)throw Error('视频待处理队列已满（最多3个）');
 const job={id:body.requestId,prompt:body.prompt.trim(),seed,preset:'smoke',...settings,...refs,modelVariant,referenceIds,steps:modelVariant==='ref2va'?20:settings.steps,sampler:modelVariant==='ref2va'?'res_multistep':'euler',status:'queued',stage:'等待图文和视频计算空闲',createdAt:new Date().toISOString()};for(const [role,id] of Object.entries(refs)){fs.mkdirSync(videoDir(job.id),{recursive:true});fs.copyFileSync(path.join(references,id+'.png'),path.join(videoDir(job.id),role+'.png'));}for(const [index,id] of referenceIds.entries()){fs.mkdirSync(videoDir(job.id),{recursive:true});fs.copyFileSync(path.join(references,id+'.png'),path.join(videoDir(job.id),`ref_${index}.png`));}saveVideo(job);return job;
}
export function stopVideo(id){const job=readVideo(id);if(job.status==='queued'){job.status='cancelled';job.stage='已取消排队';job.finishedAt=new Date().toISOString();saveVideo(job);}else if(active.has(job.status)){fs.writeFileSync(path.join(videoDir(id),'stop.request'),'');}return job;}
export function startVideo({imagesBusy=false,chatBusy=false}={},launch){if(imagesBusy||chatBusy||videoBusy())return;const job=listVideos().filter(j=>j.status==='queued').at(-1);if(!job)return;
 job.status='starting';job.startedAt=new Date().toISOString();job.stage='检查内存并启动独立视频服务';saveVideo(job);
 let logFd;
 try{if(!launch)logFd=fs.openSync(path.join(videoDir(job.id),'worker.log'),'a');const child=launch?launch(job):spawn(path.join(base,'venv/bin/python'),[path.join(root,'src/video_worker.py'),'--job-dir',videoDir(job.id),'--base',base],{detached:true,stdio:['ignore',logFd,logFd]});job.workerPid=child.pid;saveVideo(job);child.on('error',e=>{saveVideo({...job,status:'failed',error:'无法启动视频环境：'+e.message,finishedAt:new Date().toISOString()});});child.unref();}catch(e){saveVideo({...job,status:'failed',error:e.message,finishedAt:new Date().toISOString()});}finally{if(logFd!==undefined)fs.closeSync(logFd);}
}

export function deleteVideo(id){const job=readVideo(id);if(active.has(job.status)||alive(job.workerPid)||alive(job.serverPid))throw Error('请先停止视频任务，等待进程退出后再删除');fs.rmSync(videoDir(id),{recursive:true,force:true});return {id,deleted:true};}

export function videoModels(){let download=null;try{download=JSON.parse(fs.readFileSync(path.join(base,'ref2va-download-status.json'),'utf8'));}catch{}return {ref2vaReady:fs.existsSync(path.join(base,'ref2va-verified.json')),download};}
