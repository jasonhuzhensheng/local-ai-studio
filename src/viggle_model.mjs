import fs from 'node:fs';
import path from 'node:path';
import {models,root} from './image_paths.mjs';
import {retryReadSync} from './fs_read_retry.mjs';

const adapterName='Qwen-Image-2.1-viggle-turbo-4step-lora-r64.safetensors';
const v02AdapterName='Qwen-Image-2.1-viggle-turbo-v0.2.1-6step-lora-r256.safetensors';
function baseReady(){
  try{return retryReadSync(()=>{
    const base=process.env.LOCAL_VIGGLE_BASE||path.join(models,'Qwen-Image-2.1-diffusers');
    const modelIndex=JSON.parse(fs.readFileSync(path.join(base,'model_index.json'),'utf8'));
    if(typeof modelIndex._class_name!=='string')return false;
    for(const [component,expectedShards] of [['transformer',2],['text_encoder',4]]){
      const indexPath=path.join(base,component,component==='transformer'?'diffusion_pytorch_model.safetensors.index.json':'model.safetensors.index.json');
      const index=JSON.parse(fs.readFileSync(indexPath,'utf8'));
      const shards=[...new Set(Object.values(index.weight_map))];
      if(shards.length!==expectedShards||shards.some(name=>{
        try{return fs.statSync(path.join(base,component,name)).size<1000000000;}catch{return true;}
      }))return false;
    }
    const vae=path.join(base,'vae/diffusion_pytorch_model.safetensors');
    return fs.statSync(vae).size>=100000000&&fs.existsSync(path.join(root,'.local/viggle-env/bin/python3'));
  });}catch{return false;}
}
export function viggleReady(){
  try{return retryReadSync(()=>{
    const adapter=path.join(models,'viggle-qwen-turbo',adapterName);
    const adapterStat=fs.statSync(adapter);
    if(adapterStat.size!==339832808)return false;
    const config=JSON.parse(fs.readFileSync(path.join(models,'viggle-qwen-turbo/scheduler/scheduler_config.json'),'utf8'));
    if(config.shift_terminal!==null)return false;
    return baseReady();
  });}catch{return false;}
}

export function viggleV021Ready(){
  try{return retryReadSync(()=>{
    const dir=process.env.LOCAL_VIGGLE_V021||path.join(models,'viggle-qwen-turbo-v021');
    if(fs.statSync(path.join(dir,v02AdapterName)).size!==1359147904)return false;
    const verified=JSON.parse(fs.readFileSync(path.join(dir,'verified.json'),'utf8'));
    if(verified.revision!=='b77064be8b3f0b1a13c6a212067cb3d281c60c84'||verified.sha256!=='2a0148f5c73abbed5f97da5ea356e439318aadb281d01fce4af39cdf43728803')return false;
    const config=JSON.parse(fs.readFileSync(path.join(dir,'scheduler/scheduler_config.json'),'utf8'));
    return config.shift_terminal===null&&baseReady();
  });}catch{return false;}
}

export function viggleModelReady(modelId){
  if(["viggle-qwen-image-2.1-v0.3","viggle-qwen-image-2.1-v0.3-9step"].includes(modelId))return viggleV03Ready();
  if(modelId==='viggle-qwen-image-2.1-4step')return viggleReady();
  if(modelId==='viggle-qwen-image-2.1-v0.2.1')return viggleV021Ready();
  return false;
}

export function viggleV03Ready(){
  try{
    const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/viggle_turbo_v03_model.json'),'utf8'));
    const dir=process.env.LOCAL_VIGGLE_V03||path.join(models,'viggle-qwen-turbo-v03');
    const verified=JSON.parse(fs.readFileSync(path.join(dir,'verified.json'),'utf8'));
    const config=JSON.parse(fs.readFileSync(path.join(dir,'scheduler/scheduler_config.json'),'utf8'));
    return fs.statSync(path.join(dir,manifest.file)).size===manifest.bytes&&verified.sha256===manifest.sha256&&verified.revision===manifest.revision&&config.shift_terminal===null&&baseReady();
  }catch{return false;}
}
