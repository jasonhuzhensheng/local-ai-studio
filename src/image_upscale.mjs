import fs from 'node:fs';
import path from 'node:path';
import {models,binary} from './image_paths.mjs';
export const upscaleModel=path.join(models,'RealESRGAN_x4plus.pth');
export function pngSize(file){
 const b=Buffer.alloc(24),fd=fs.openSync(file,'r');
 try{if(fs.readSync(fd,b,0,24,0)!==24||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('输出不是有效PNG');}finally{fs.closeSync(fd);}
 return [b.readUInt32BE(16),b.readUInt32BE(20)];
}
// run starts one managed child at a time; the worker retains cancellation and queue ownership.
export async function enhance8k(base,output,run,stage,engine=binary){
 const dir=path.dirname(base);let input=base;
 let [w,h]=pngSize(input);
 if(Math.max(w,h)<1920){
  stage('细节增强 1/2');
  const first=path.join(dir,'detail-first.png');
  await upscale(input,first,w,h);input=first;[w,h]=pngSize(input);
 }
 const prepared=path.join(dir,'detail-input.png');
 stage('准备8K放大');
 // Only downsample here; never disguise ordinary interpolation as AI restoration.
 if(Math.max(w,h)<1920)throw Error('基础图过小；8K细节模式需要长边至少480像素');
 await run('/usr/bin/sips',['-Z','1920',input,'--out',prepared]);
 [w,h]=pngSize(prepared);
 stage('分块放大至8K');
 await upscale(prepared,output,w,h);
 const dimensions=pngSize(output);
 if(Math.max(...dimensions)!==7680)throw Error('8K输出尺寸验证失败');
 for(const name of ['detail-first.png','detail-input.png'])fs.rmSync(path.join(dir,name),{force:true});
 return dimensions;
 async function upscale(source,destination,width,height){
  await run(engine,['-M','upscale','-i',source,'--upscale-model',upscaleModel,'--upscale-tile-size','128','--upscale-repeats','1','-o',destination]);
  const [ow,oh]=pngSize(destination);
  if(ow!==width*4||oh!==height*4)throw Error('超分模型未正确放大；基础图已保留');
 }
}
