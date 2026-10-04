import fs from 'node:fs';
import path from 'node:path';
import {submitImage} from './image_submit.mjs';
import {readJob} from './image_jobs.mjs';
import {root} from './image_paths.mjs';
import {pngSize} from './image_upscale.mjs';
const file=path.join(root,'.local/detail-8k-acceptance.json');
if(fs.existsSync(file))throw Error('Existing acceptance report; refusing duplicate');
const parameters={model_id:'qwen-image-2.1',prompt:'A detailed watercolor illustration of a cozy cottage by a lake, colorful flowers, morning sunshine, no people, no text',negative_prompt:'blurry, watermark',width:512,height:512,steps:20,seed:42,cfg_scale:6,cache_mode:'easycache',detail_mode:'8k'};
const {id}=submitImage(parameters);const report={id,parameters,status:'queued',visualReview:'pending'};
const save=()=>fs.writeFileSync(file,JSON.stringify(report,null,2));save();
while(true){
 const job=readJob(id);report.status=job.status;report.stage=job.stage;report.progress=job.enhanceProgress||job.progress;save();
 if(['completed','failed'].includes(job.status)){
  report.seconds=(Date.parse(job.finishedAt)-Date.parse(job.startedAt))/1000;
  report.error=job.error;report.image=job.image;if(job.image)report.dimensions=pngSize(job.image);save();break;
 }
 await new Promise(r=>setTimeout(r,5000));
}
