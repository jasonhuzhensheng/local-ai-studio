// Isolated two-request test: one queue slot, one loopback-only server, always shut down.
import net from 'node:net';
import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';
import {root,models} from './image_paths.mjs';
const [statusFile,output]=process.argv.slice(2),job=JSON.parse(fs.readFileSync(statusFile));
const reportFile=path.join(path.dirname(output),'server-trial.json');
const report={status:'starting',runs:[]};const save=()=>fs.writeFileSync(reportFile,JSON.stringify(report,null,2));save();
const probe=net.createServer();await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(0,'127.0.0.1',resolve);});const port=probe.address().port;await new Promise(r=>probe.close(r));
const base=`http://127.0.0.1:${port}`;let stopped=false,killTimer;
const server=spawn(path.join(root,job.benchmark_reference_cache?'.local/sd-qwen-cache/build/bin/sd-server':'.local/stable-diffusion.cpp/build/bin/sd-server'),[
 '--listen-ip','127.0.0.1','--listen-port',String(port),
 '--diffusion-model',path.join(models,'qwen_image_2.1-Q4_K.gguf'),
 '--llm',path.join(models,'Qwen3VL-8B-Instruct-Q4_K_M.gguf'),
 '--llm_vision',path.join(models,'mmproj-Qwen3VL-8B-Instruct-F16.gguf'),
 '--vae',path.join(models,'qwen_image_2.1_vae_bf16.safetensors'),
 '--offload-to-cpu','--ref-image-args','vae_input_max_pixels=1048576'],{stdio:['ignore','inherit','inherit'],env:{...process.env,SD_QWEN_REF_CACHE:job.benchmark_reference_cache?'1':'0'}});
let serverError,serverClosed=false;server.once('error',e=>{serverError=e;});
const closed=new Promise(r=>server.once('close',()=>{serverClosed=true;r();}));
function stop(){if(stopped)return;stopped=true;if(serverClosed)return;server.kill('SIGTERM');killTimer=setTimeout(()=>{if(!serverClosed)server.kill('SIGKILL');},5000);}
process.once('SIGTERM',stop);process.once('SIGINT',stop);
const began=Date.now();
try{
 while(true){if(stopped)throw Error('Test cancelled');if(serverError)throw serverError;if(serverClosed||server.exitCode!==null)throw Error('Test server exited');
  try{const r=await fetch(base+'/sdcpp/v1/capabilities',{signal:AbortSignal.timeout(2000)});if(r.ok)break;}catch{}
  if(Date.now()-began>180000)throw Error('Test server startup timeout');await new Promise(r=>setTimeout(r,1000));
 }
 report.startupSeconds=(Date.now()-began)/1000;report.status="running";save();
 const params={prompt:job.prompt,negative_prompt:job.negative_prompt,width:job.width,height:job.height,seed:job.seed,batch_count:1,ref_images:job.referenceImages.map(p=>fs.readFileSync(p).toString('base64')),sample_params:{sample_method:'euler',sample_steps:job.steps,guidance:{txt_cfg:job.cfg_scale}},cache_mode:job.cache_mode,output_format:'png'};
 for(let i=0;i<2;i++){
  if(stopped)throw Error('Test cancelled');console.log(`[server-trial] request ${i+1}/2`);
  const start=Date.now(),r=await fetch(base+'/sdcpp/v1/img_gen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(params),signal:AbortSignal.timeout(30000)});
  const accepted=await r.json();if(!r.ok)throw Error(JSON.stringify(accepted));
  while(true){if(stopped)throw Error('Test cancelled');if(Date.now()-start>1800000)throw Error('Generation timeout');
   const response=await fetch(base+accepted.poll_url,{signal:AbortSignal.timeout(10000)}),state=await response.json();
   if(state.status==='completed'){
    const bytes=Buffer.from(state.result.images[0].b64_json,'base64');
    const file=path.join(path.dirname(output),`server-${i+1}.png`);fs.writeFileSync(file,bytes);fs.writeFileSync(output,bytes);
    report.runs.push({index:i+1,seconds:(Date.now()-start)/1000,image:file});save();break;
   }
   if(['failed','cancelled'].includes(state.status))throw Error(JSON.stringify(state.error));
   await new Promise(r=>setTimeout(r,1000));
  }
 }
 report.status='completed';save();
}catch(e){report.status='failed';report.error=e.message;save();process.exitCode=1;}
finally{stop();await closed;clearTimeout(killTimer);}
