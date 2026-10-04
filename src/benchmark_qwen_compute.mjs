import fs from 'node:fs';import path from 'node:path';
import {root,jobDir} from './image_paths.mjs';
import {submitImage} from './image_submit.mjs';import {readJob,listJobs} from './image_jobs.mjs';
const file=path.join(root,'.local/qwen-compute-benchmark.json');
if(fs.existsSync(file))throw Error('Report exists; refusing duplicate');
const parameters={prompt:'Replace only the background with a plain light blue studio backdrop. Preserve the same person, facial features, expression, hairstyle, headband, T-shirt, pose, raised arm, framing and natural photographic appearance. Keep all clothing unchanged.',negative_prompt:'distorted face, extra fingers, extra limbs, blurry',reference_id:'323a4a3d-45b7-4ced-8666-1c237c280cb8',width:384,height:512,steps:20,seed:42,cfg_scale:6,cache_mode:'easycache'};
const report={status:'waiting',parameters,results:[],visualReview:'pending'};const save=()=>fs.writeFileSync(file,JSON.stringify(report,null,2));save();
try{
 for(const qwen_optimization of ['baseline','resident','vae_direct']){
  while(listJobs().some(j=>['queued','running','starting'].includes(j.status)))await new Promise(r=>setTimeout(r,5000));
  const {id}=submitImage({...parameters,qwen_optimization});const row={id,qwen_optimization,status:'queued'};report.results.push(row);report.status='running';save();
  while(true){const j=readJob(id);row.status=j.status;row.stage=j.stage;save();if(['completed','failed'].includes(j.status)){
   row.seconds=(Date.parse(j.finishedAt)-Date.parse(j.startedAt))/1000;row.image=j.image;row.error=j.error;
   const log=fs.readFileSync(path.join(jobDir(id),'generation.log'),'utf8');row.samplingSeconds=Number(log.match(/sampling completed, taking ([\d.]+)s/)?.[1]);row.decodeSeconds=Number(log.match(/decode_first_stage completed, taking ([\d.]+)s/)?.[1]);save();
   if(j.status!=='completed')throw Error(j.error);break;
  }await new Promise(r=>setTimeout(r,5000));}
 }
 report.status='completed';save();
}catch(e){report.status='stopped';report.error=e.message;save();throw e;}
