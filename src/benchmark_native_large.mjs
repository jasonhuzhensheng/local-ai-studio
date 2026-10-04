import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {root,jobDir} from './image_paths.mjs';import {submitImage} from './image_submit.mjs';import {readJob} from './image_jobs.mjs';
const file=path.join(root,'.local/native-large-benchmark.json');
const resume=process.argv.includes('--resume'),retryFailed=process.argv.includes('--retry-failed');
if(fs.existsSync(file)&&!resume)throw Error('Report exists; use --resume to track existing jobs');
const old=JSON.parse(fs.readFileSync(path.join(root,'.local/qwen-five-stage-benchmark.json')));
const parameters={...old.parameters,width:1152,height:1536,steps:20,cfg_scale:6,cache_mode:'easycache',vae_tile_size:32,reference_max_pixels:1048576};
const report=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{status:'running',parameters,results:[],visualReview:'pending',note:'Same latent decoded at32/48; second job changes only diffusion weight offload. No preview models or upscaling.'};
if(report.runnerPid&&report.runnerPid!==process.pid){let alive=false;try{process.kill(report.runnerPid,0);alive=true;}catch(e){if(e.code!=='ESRCH')alive=true;}if(alive)throw Error('Another runner may still be alive');}
report.runnerPid=process.pid;report.status='running';
const save=()=>{report.updatedAt=new Date().toISOString();fs.writeFileSync(file+'.tmp',JSON.stringify(report,null,2));fs.renameSync(file+'.tmp',file);};save();
try{
 for(const mode of ['dual_decode','resident_profile']){
  let row=report.results.findLast(r=>r.mode===mode);
  if(row){
    const current=readJob(row.id);row.status=current.status;row.error=current.error;save();
    if(row.status==='completed'&&row.samplingSeconds)continue;
    if(row.status==='failed'){
      if(!retryFailed)throw Error('Existing trial failed; explicit --retry-failed required');
      report.attempts??=[];report.attempts.push({...row});report.results=report.results.filter(r=>r!==row);row=null;save();
    }
  }
  if(!row){
    const {id}=submitImage({...report.parameters,qwen_optimization:mode==='resident_profile'?'resident':'baseline'},{nativeTrial:mode});
    row={id,mode,status:'queued',peakRssMiB:0};report.results.push(row);save();
  }
  const id=row.id;
  while(true){const j=readJob(id);row.status=j.status;row.progress=j.progress;row.decodeProgress=j.decodeProgress;row.stage=j.stage;
   if(Number.isInteger(j.generationPid)&&j.status==='running'){
    try{const rss=Number(execFileSync('/bin/ps',['-p',String(j.generationPid),'-o','rss='],{encoding:'utf8',timeout:2000}).trim());if(Number.isFinite(rss)){row.peakRssMiB=Math.max(row.peakRssMiB,rss/1024);if(j.stage==='正在生成')row.peakSamplingRssMiB=Math.max(row.peakSamplingRssMiB||0,rss/1024);}}catch{}
   }
   const logFile=path.join(jobDir(id),'generation.log');
   if(fs.existsSync(logFile)){
    const live=fs.readFileSync(logFile,'utf8');
    row.forwardMs=[...live.matchAll(/NATIVE_PROFILE forward_ms=(\d+)/g)].map(m=>Number(m[1]));
    row.computeSeconds=row.forwardMs.reduce((a,b)=>a+b,0)/1000;
   }
   save();if(['completed','failed'].includes(j.status)){
    row.error=j.error;row.seconds=(Date.parse(j.finishedAt)-Date.parse(j.startedAt))/1000;
    const log=fs.readFileSync(path.join(jobDir(id),'generation.log'),'utf8');
    row.forwardMs=[...log.matchAll(/NATIVE_PROFILE forward_ms=(\d+)/g)].map(m=>Number(m[1]));
    row.computeSeconds=row.forwardMs.reduce((a,b)=>a+b,0)/1000;
    for(const [key,re] of Object.entries({samplingSeconds:/sampling completed, taking ([\d.]+)s/,decodeSeconds:/decode_first_stage completed, taking ([\d.]+)s/,referenceSeconds:/encode_first_stage completed, taking ([\d.]+)s/,decode32Ms:/NATIVE_PROFILE decode32_ms=(\d+)/,decode48Ms:/NATIVE_PROFILE decode48_ms=(\d+)/}))row[key]=Number(log.match(re)?.[1])||null;
    row.image=j.image;save();if(j.status==='completed'&&(!row.forwardMs.length||(mode==='dual_decode'&&(!row.decode32Ms||!row.decode48Ms))))throw Error('Required profiling markers missing');if(j.status!=='completed')throw Error('Trial failed; stopped, inspect logs');break;
   }
   await new Promise(r=>setTimeout(r,5000));
  }
 }
 report.status='completed-needs-review';save();
}catch(e){report.status='stopped';report.error=e.message;save();process.exitCode=1;}
