import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {jobs,models,binary,references,uuidPattern} from './image_paths.mjs';
import {upscaleModel} from './image_upscale.mjs';
import {saveJob, listJobs} from './image_jobs.mjs';
import {viggleModelReady} from './viggle_model.mjs';
export {references,uuidPattern};
let lastCreated = 0;
export function saveReference(data) {
  if(typeof data!=='string'||data.length>15000000)throw Error('图片过大，请选择较小的图片');
  const bytes=Buffer.from(data,'base64');
  if(bytes.length<24||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('请选择有效的PNG图片');
  const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20);
  if(!w||!h||w>2048||h>2048)throw Error('参考图边长不能超过2048');
  fs.mkdirSync(references,{recursive:true});const id=randomUUID();
  fs.writeFileSync(path.join(references,id+'.png'),bytes);return id;
}
export function submitImage(args, internal = {}) {
  const {prompt,reference_id}=args;
  const model_id=args.model_id??'qwen-image-2.1';
  if(!['qwen-image-2.1','wai-illustrious-v17','viggle-qwen-image-2.1-4step','viggle-qwen-image-2.1-v0.2.1','viggle-qwen-image-2.1-v0.3','viggle-qwen-image-2.1-v0.3-9step'].includes(model_id))throw Error('不支持的模型');
  const wai=model_id==='wai-illustrious-v17';
  const viggle=model_id.startsWith('viggle-qwen-image-2.1-');
  const viggleSteps=model_id==='viggle-qwen-image-2.1-v0.3-9step'?9:['viggle-qwen-image-2.1-v0.2.1','viggle-qwen-image-2.1-v0.3'].includes(model_id)?6:4;
  if(typeof prompt!=='string'||!prompt.trim()||prompt.length>6000)throw Error('请输入修改要求（最多6000字符）');
  const negative_prompt=args.negative_prompt??'';
  if(typeof negative_prompt!=='string'||negative_prompt.length>6000)throw Error('反向提示词最多6000字符');
  const job={model_id,prompt,negative_prompt,width:args.width??(viggle?1024:512),height:args.height??(viggle?1024:512),steps:args.steps??(viggle?viggleSteps:20),seed:args.seed??Math.floor(Math.random()*2147483648)};
  job.large_mode=args.large_mode??'balanced';
  if(!['balanced','faster'].includes(job.large_mode))throw Error('大图加速模式不正确');
  if(job.large_mode==='faster'&&(wai||(!viggle&&job.width*job.height<=1048576)))throw Error('Qwen大图加速仅适用于超过100万像素的Qwen任务');
  if(args.vae_tile_size !== undefined){
    if(![32,48,64].includes(args.vae_tile_size))throw Error("解码测试分块只支持32、48或64");
    job.vae_tile_size=args.vae_tile_size;
  }
  if(args.reference_max_pixels !== undefined){
    if(![786432,1048576].includes(args.reference_max_pixels))throw Error('不支持的参考编码像素上限');
    job.reference_max_pixels=args.reference_max_pixels;
  }
  job.detail_mode=args.detail_mode??'standard';
  if(!['standard','8k'].includes(job.detail_mode))throw Error('不支持的细节模式');
  if(job.detail_mode==='8k'){
    if(Math.max(job.width,job.height)<480)throw Error('8K基础图长边至少480像素');
    if(!fs.existsSync(upscaleModel))throw Error('8K超分模型尚未安装');
  }
  job.qwen_optimization=!viggle&&job.large_mode==='faster'?'resident':(args.qwen_optimization??'baseline');
  if(viggle&&job.qwen_optimization!=='baseline')throw Error('Viggle 使用独立推理参数');
  if(!['baseline','resident','vae_direct'].includes(job.qwen_optimization))throw Error('不支持的Qwen计算方案');
  if(wai&&job.qwen_optimization!=='baseline')throw Error('此优化只适用于Qwen');
  job.cfg_scale=args.cfg_scale??(viggle?1:6);
  if(![1,6].includes(job.cfg_scale))throw Error('CFG模式须为1或6');
  if(viggle&&(job.steps!==viggleSteps||job.cfg_scale!==1||negative_prompt))throw Error(`Viggle ${viggleSteps}步版固定${viggleSteps}步、不使用反向提示词，CFG=1`);
  job.cache_mode=args.cache_mode??'none';
  if(viggle&&job.cache_mode!=='none')throw Error('Viggle 4步版不使用EasyCache或Spectrum');
  if(args.cache_threshold!==undefined){
    if(wai||job.cache_mode!=='easycache'||![0.2,0.3,0.4].includes(args.cache_threshold))throw Error('缓存强度只支持Qwen EasyCache的0.2/0.3/0.4');
    job.cache_threshold=args.cache_threshold;
  }
  if(!['none','easycache','spectrum'].includes(job.cache_mode))throw Error('缓存模式不正确');
  for(const k of ['width','height'])if(!Number.isInteger(job[k])||job[k]<256||job[k]>2752||job[k]%32)throw Error('边长须为256–2752之间的32倍数');
  if(job.width*job.height>4325376)throw Error('分辨率最多约432万像素');
  if(!Number.isInteger(job.steps)||job.steps<1||job.steps>50||!Number.isInteger(job.seed)||job.seed<0||job.seed>2147483647)throw Error('生成参数不正确');
  const refs=args.reference_ids??(reference_id?[reference_id]:[]);
  if(!Array.isArray(refs)||refs.length>10||refs.some(id=>typeof id!=='string'||!uuidPattern.test(id)))throw Error('请选择最多10张有效参考图');
  if(model_id.startsWith("viggle-qwen-image-2.1-v0.3")&&refs.length>3)throw Error("Viggle v0.3最多支持3张参考图");
  if(wai){
    if(refs.length)throw Error('WAI 当前支持文字生图；参考图编辑请选择 Qwen');
    if(job.cache_mode!=='none'||job.cfg_scale!==6)throw Error('WAI 请使用无缓存、标准CFG6');
    if(job.width*job.height>2097152)throw Error('WAI 当前最多支持约200万像素，建议1024×1024');
    if(!fs.existsSync(path.join(models,'waiIllustriousSDXL_v170.safetensors')))throw Error('WAI 模型尚未安装完成');
  }
  if(viggle){
    if(!viggleModelReady(model_id))throw Error('所选 Viggle 版本或本地运行环境仍在安装');
  }
  job.reference_ids=refs; job.referenceImages=refs.map(id=>path.join(references,id+'.png'));
  if(refs.length){
    if(job.referenceImages.some(file=>!fs.existsSync(file)))throw Error('找不到参考图，请先上传');
    if(!viggle&&!fs.existsSync(path.join(models,'mmproj-Qwen3VL-8B-Instruct-F16.gguf')))throw Error('视觉编码器尚未安装完成');
  }
  if(!fs.existsSync(binary))throw Error('绘图后端未安装');
  fs.mkdirSync(jobs,{recursive:true});
  if(listJobs().filter(j=>['queued','starting','running'].includes(j.status)).length>=20)throw Error('最多同时保留20个待处理任务，请等待或删除部分任务');
  const id=randomUUID(),dir=path.join(jobs,id);
  if(internal.benchmarkServer===true){job.benchmark_server=true;job.benchmark_reference_cache=internal.benchmarkReferenceCache===true;}
  if(['dual_decode','resident_profile'].includes(internal.nativeTrial))job.native_trial=internal.nativeTrial;
  lastCreated=Math.max(Date.now(),lastCreated+1);
  fs.mkdirSync(dir);saveJob({...job,id,status:'queued',createdAt:new Date(lastCreated).toISOString()});
  return {id,reference_id,reference_ids:refs,status:'queued',viewerUrl:`http://127.0.0.1:1235/jobs/${id}`};
}
