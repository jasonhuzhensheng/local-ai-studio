import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
import {root,jobDir} from './image_paths.mjs';import {submitImage} from './image_submit.mjs';import {readJob,saveJob} from './image_jobs.mjs';
const prior=path.join(root,'.local/qwen-five-stage-benchmark.json'),file=path.join(root,'.local/qwen-followup-trials.json');
if(fs.existsSync(file))throw Error('Followup report exists; refusing duplicate');
const report={status:'waiting-for-steps-and-cache',stages:[]};const save=()=>fs.writeFileSync(file,JSON.stringify(report,null,2));save();
const wait=()=>new Promise(r=>setTimeout(r,5000));
try{
 let previous;
 while(true){previous=JSON.parse(fs.readFileSync(prior));if(previous.status==='completed')break;if(previous.status==='stopped')throw Error('Earlier comparison failed; inspect before continuing');await wait();}
 report.status='checking-mlx';save();
 const cli=path.join(root,'.local/mflux-env/bin/mflux-generate-qwen-2.1');
 let supportsMulti=null;
 if(fs.existsSync(cli)){
  const help=spawnSync(cli,['--help'],{encoding:'utf8',timeout:60000});
  fs.writeFileSync(path.join(root,'.local/mflux-qwen21-help.txt'),(help.stdout||'')+(help.stderr||''));
  if(help.status===0)supportsMulti=help.stdout.includes('--image-paths');
 }
 report.stages.push({stage:3,status:'not-equivalent-for-current-editor',supportsMultiImageFlag:supportsMulti,note:'Official Qwen21 source README documents single-image img2img, not equivalent multi-reference instruction editing. Dependency install may still be running. No MLX speed claim or model weights download.'});save();
 for(const cached of [true,false]){
  const binary=path.join(root,cached?'.local/sd-qwen-cache/build/bin/sd-server':'.local/stable-diffusion.cpp/build/bin/sd-server');
  if(!fs.existsSync(binary))throw Error('Server binary not built');
  const {id}=submitImage({...previous.parameters},{benchmarkServer:true,benchmarkReferenceCache:cached});
  const row={stage:cached?4:5,id,status:'queued',referenceCache:cached};report.stages.push(row);report.status='running';save();
  while(true){const j=readJob(id);row.status=j.status;save();if(['completed','failed'].includes(j.status)){
   row.error=j.error;const detail=path.join(jobDir(id),'server-trial.json');if(fs.existsSync(detail))row.measurement=JSON.parse(fs.readFileSync(detail));
   const log=fs.readFileSync(path.join(jobDir(id),'generation.log'),'utf8');row.referenceCacheHits=(log.match(/Qwen reference VAE cache hit/g)||[]).length;
   row.referenceEncodeSeconds=[...log.matchAll(/encode_first_stage completed, taking ([\d.]+)s/g)].map(m=>Number(m[1]));
   row.promptEncodeSeconds=[...log.matchAll(/get_learned_condition completed, taking ([\d.]+)s/g)].map(m=>Number(m[1]));
   save();break;
  }await wait();}
 }
 report.status='completed-needs-review';save();
}catch(e){report.status='stopped';report.error=e.message;save();throw e;}
