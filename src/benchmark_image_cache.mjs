import fs from 'node:fs';
import path from 'node:path';
import {submitImage} from './image_submit.mjs';
import {readJob, listJobs} from './image_jobs.mjs';
import {root, jobDir} from './image_paths.mjs';

// Use the existing FIFO scheduler so benchmarks never run alongside user jobs.
if(listJobs().some(j=>['queued','starting','running'].includes(j.status)))throw Error('请在图片队列空闲时开始对照');
const report={createdAt:new Date().toISOString(),parameters:{
  prompt:'Change the red ceramic mug to blue. Keep the same mug shape, wooden table and background. Photorealistic product photograph.',
  negative_prompt:'text, watermark, blurry, extra cups',
  reference_ids:['fb6f4947-fa33-4c95-ab31-18542f780f35'],
  width:512,height:512,steps:20,seed:42},results:[]};
const file=path.join(root,'.local/image-cache-benchmark.json');
for(const cache_mode of ['none','easycache','spectrum']){
  const submitted=submitImage({...report.parameters,cache_mode});
  const result={cache_mode,id:submitted.id,status:'queued'};
  report.results.push(result);fs.writeFileSync(file,JSON.stringify(report,null,2));
  console.log(JSON.stringify(result));
  let previous='';
  while(true){
    await new Promise(resolve=>setTimeout(resolve,5000));
    let job;
    try{job=readJob(submitted.id);}catch(error){if(error.code==='ENOENT')throw Error('测试任务已被删除，停止对照');throw error;}
    const state=JSON.stringify({mode:cache_mode,status:job.status,progress:job.progress,stage:job.stage});
    if(state!==previous){console.log(state);previous=state;}
    if(!['completed','failed'].includes(job.status))continue;
    Object.assign(result,{status:job.status,seconds:(Date.parse(job.finishedAt)-Date.parse(job.startedAt))/1000,image:job.image,error:job.error});
    const log=fs.readFileSync(path.join(jobDir(job.id),'generation.log'),'utf8');
    result.cacheLog=log.split(/[\r\n]+/).filter(line=>/EasyCache|Spectrum|sampling completed/i.test(line)).slice(-25);
    fs.writeFileSync(file,JSON.stringify(report,null,2));console.log(JSON.stringify(result));
    if(job.status==='failed')throw Error('推理失败，停止后续测试');
    break;
  }
}
