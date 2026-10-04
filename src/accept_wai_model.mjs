// A benign text-only acceptance job, submitted through the normal FIFO queue.
import fs from 'node:fs';
import path from 'node:path';
import {submitImage} from './image_submit.mjs';
import {readJob} from './image_jobs.mjs';
import {root} from './image_paths.mjs';
const reportFile=path.join(root,'.local/wai-acceptance.json');
if(fs.existsSync(reportFile))throw Error('Acceptance report already exists; do not duplicate jobs');
const args={model_id:'wai-illustrious-v17',prompt:'masterpiece, best quality, beautiful anime background illustration, a small cozy cottage beside a lake, flower garden, clear morning light, detailed trees, no people',negative_prompt:'low quality, blurry, text, watermark',width:1024,height:1024,steps:15,seed:42,cfg_scale:6,cache_mode:'none'};
const submitted=submitImage(args);
const report={id:submitted.id,parameters:args,status:'queued',visualReview:'pending'};
const save=()=>fs.writeFileSync(reportFile,JSON.stringify(report,null,2));save();
while(true){
 const job=readJob(submitted.id);report.status=job.status;report.stage=job.stage;report.progress=job.progress;save();
 if(['completed','failed'].includes(job.status)){
  report.seconds=(Date.parse(job.finishedAt)-Date.parse(job.startedAt))/1000;
  report.image=job.image;report.error=job.error;save();console.log(JSON.stringify(report));break;
 }
 await new Promise(resolve=>setTimeout(resolve,5000));
}
