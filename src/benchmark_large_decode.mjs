import fs from 'node:fs';
import path from 'node:path';
import {submitImage} from './image_submit.mjs';
import {listJobs,readJob} from './image_jobs.mjs';
import {root,jobDir} from './image_paths.mjs';

// Reuse the user's approved local benchmark, without embedding personal inputs.
const tile64=process.argv.includes('--tile64');
const matched=tile64||process.argv.includes('--matched-ratio');
const file=path.join(root,tile64?'.local/large-decode-64.json':matched?'.local/large-decode-matched.json':'.local/large-decode-benchmark.json');
if(fs.existsSync(file))throw Error('已有大图对照报告，请先检查，避免重复提交');
if(!tile64 && listJobs().some(j=>['queued','starting','running'].includes(j.status)))throw Error('请等队列空闲后开始');
const previous=JSON.parse(fs.readFileSync(path.join(root,'.local/portrait-speed-benchmark.json')));
const report={createdAt:new Date().toISOString(),status:'running',parameters:{...previous.parameters,width:matched?1152:768,height:1536,...(matched?{reference_max_pixels:786432}:{}),steps:20,cfg_scale:1,cache_mode:'easycache'},results:[],visualReview:'pending'};
const save=()=>{const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(report,null,2));fs.renameSync(temp,file);};
save();
try{
  if(tile64){
    report.status='waiting-for-idle';save();
    while(listJobs().some(j=>['queued','starting','running'].includes(j.status)))await new Promise(r=>setTimeout(r,10000));
    report.status='running';save();
  }
  for(const vae_tile_size of (tile64?[48,64]:[32,48])){
    const submitted=submitImage({...report.parameters,vae_tile_size});
    const result={id:submitted.id,vae_tile_size,status:'queued'};
    report.results.push(result);save();console.log(JSON.stringify(result));
    let last='';
    for(;;){
      await new Promise(r=>setTimeout(r,5000));
      const job=readJob(result.id);
      const state=JSON.stringify({id:job.id,status:job.status,progress:job.progress,decodeProgress:job.decodeProgress});
      if(state!==last){console.log(state);last=state;}
      if(!['failed','completed'].includes(job.status))continue;
      const log=fs.readFileSync(path.join(jobDir(job.id),'generation.log'),'utf8');
      const timing=pattern=>{const m=log.match(pattern);return m?Number(m[1]):null;};
      Object.assign(result,{status:job.status,seconds:(Date.parse(job.finishedAt)-Date.parse(job.startedAt))/1000,
        samplingSeconds:timing(/sampling completed, taking ([\d.]+)s/),
        decodeSeconds:timing(/decode_first_stage completed, taking ([\d.]+)s/),
        image:job.image,error:job.error});save();
      if(job.status==='failed')throw Error('测试失败，停止后续实验');
      break;
    }
  }
  report.status='completed';
  report.note='仅记录性能，必须实际查看两图及接缝后再决定是否改变默认分块。';
}catch(error){report.status='stopped';report.error=error.message;process.exitCode=1;}
finally{save();}
