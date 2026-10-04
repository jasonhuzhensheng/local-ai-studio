import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {enhance8k,pngSize} from '../src/image_upscale.mjs';
import {parseGenerationLog} from '../src/image_jobs.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'upscale-test-'));
const write=(f,w,h)=>{const b=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(b);b.writeUInt32BE(w,16);b.writeUInt32BE(h,20);fs.writeFileSync(f,b);};
try{
 for(const [w,h,passes] of [[768,1024,2],[1536,2048,1],[1920,1080,1]]){
  const base=path.join(dir,'base.png'),out=path.join(dir,'image.png');write(base,w,h);let count=0;
  const run=async(command,args)=>{
   if(command==='/usr/bin/sips'){
    const [iw,ih]=pngSize(args[2]),ratio=1920/Math.max(iw,ih);assert.ok(ratio<=1);
    write(args.at(-1),Math.round(iw*ratio),Math.round(ih*ratio));
   }else{
    count++;const [iw,ih]=pngSize(args[args.indexOf('-i')+1]);write(args.at(-1),iw*4,ih*4);
   }
  };
  const [ow,oh]=await enhance8k(base,out,run,()=>{},'mock');
  assert.equal(Math.max(ow,oh),7680);assert.ok(Math.abs(ow/oh-w/h)<0.002);assert.equal(count,passes);assert.deepEqual(pngSize(base),[w,h]);
 }
 const base=path.join(dir,'base.png');write(base,1920,1080);
 await assert.rejects(enhance8k(base,path.join(dir,'fail.png'),async(cmd,args)=>{if(cmd==='/usr/bin/sips')write(args.at(-1),1920,1080);else write(args.at(-1),1920,1080);},()=>{},'mock'),/未正确放大/);
 assert.ok(fs.existsSync(base));
 const p=parseGenerationLog('[enhance] 分块放大至8K\n4/200 - 1.5s/it');assert.equal(p.enhanceProgress.step,4);assert.equal(p.progress,undefined);
 assert.equal(parseGenerationLog('5/200 - 1.5s/it','分块放大至8K').enhanceProgress.step,5);
 console.log('PASS: 8K aspect ratio, one/two passes, no interpolation upscale, failure detection, base retention, progress');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
