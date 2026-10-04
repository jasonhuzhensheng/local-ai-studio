#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {root} from './image_paths.mjs';
import {submitImage} from './image_submit.mjs';
import {readJob, listJobs} from './image_jobs.mjs';

const reportPath=path.join(root,'.local/viggle-v021-acceptance.json');
const prompt='A single handcrafted cobalt-blue ceramic teapot on a cream linen table, warm morning light through a window, detailed realistic product photography, clean background, no lettering.';
const seed=42021,width=1024,height=1024;
const report={createdAt:new Date().toISOString(),revision:'b77064be8b3f0b1a13c6a212067cb3d281c60c84',prompt,seed,width,height,status:'queued_behind_existing',samples:[]};
function save(){
  fs.mkdirSync(path.dirname(reportPath),{recursive:true});
  const temp=reportPath+'.tmp';fs.writeFileSync(temp,JSON.stringify(report,null,2)+'\n');fs.renameSync(temp,reportPath);
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitForCapacity(){
  let last=0;
  while(listJobs().filter(job=>['queued','starting','running'].includes(job.status)).length>=18){
    const now=Date.now();
    if(now-last>30000){const count=listJobs().filter(job=>['queued','starting','running'].includes(job.status)).length;console.log(`Waiting for queue capacity (${count} active/queued); no jobs inspected or changed.`);last=now;}
    await delay(5000);
  }
}
async function waitJob(id){
  for(;;){
    const job=readJob(id);
    if(['completed','failed'].includes(job.status))return job;
    await delay(5000);
  }
}

await waitForCapacity();
save();
for(const model_id of ['viggle-qwen-image-2.1-4step','viggle-qwen-image-2.1-v0.2.1']){
  const created=submitImage({model_id,prompt,width,height,steps:model_id.endsWith('v0.2.1')?6:4,cfg_scale:1,cache_mode:'none',seed});
  const record={id:created.id,model_id,status:'queued'};report.samples.push(record);save();
  console.log(`Submitted ${model_id}: ${created.id}`);
  const job=await waitJob(created.id);
  record.status=job.status;record.startedAt=job.startedAt;record.finishedAt=job.finishedAt;
  if(job.startedAt&&job.finishedAt)record.elapsedSeconds=(Date.parse(job.finishedAt)-Date.parse(job.startedAt))/1000;
  if(job.error)record.error=job.error;
  save();
  console.log(`${model_id}: ${record.status}${record.elapsedSeconds?`, ${record.elapsedSeconds.toFixed(1)} seconds`:''}`);
  if(job.status!=='completed'){report.status='failed';save();process.exitCode=1;break;}
}
if(report.samples.length===2&&report.samples.every(sample=>sample.status==='completed'))report.status='completed';
save();
console.log(`Acceptance report: ${reportPath}`);
