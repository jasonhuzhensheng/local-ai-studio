import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawn} from 'node:child_process';import {pathToFileURL} from 'node:url';
const data=fs.mkdtempSync(path.join(os.tmpdir(),'detail-worker-'));process.env.LOCAL_IMAGE_DATA_DIR=data;
const {submitImage}=await import('../src/image_submit.mjs');
const {readJob,startNext,deleteJob}=await import('../src/image_jobs.mjs');
const {jobDir,root,jobs}=await import('../src/image_paths.mjs');
const engine=path.join(data,'fake-engine');
fs.writeFileSync(engine,`#!${process.execPath}\nconst fs=require('fs');const a=process.argv.slice(2);if(a.includes('-M')){if(process.env.FAIL_DETAIL==='1')process.exit(3);console.log('2/9 - 1.2it/s');process.on('SIGTERM',()=>{});setInterval(()=>{},1000);}else{const b=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(b);b.writeUInt32BE(512,16);b.writeUInt32BE(512,20);fs.writeFileSync(a[a.indexOf('-o')+1],b);}`);fs.chmodSync(engine,0o755);
const children=[];
const launch=fail=>id=>{const code=`import {runWorker} from ${JSON.stringify(pathToFileURL(path.join(root,'src/image_worker.mjs')).href)};runWorker(${JSON.stringify(id)},${JSON.stringify(engine)},(job,out)=>['-o',out]);`;const c=spawn(process.execPath,['--input-type=module','-e',code],{env:{...process.env,FAIL_DETAIL:fail?'1':'0'},stdio:'ignore'});children.push(c);return c;};
const wait=async fn=>{const end=Date.now()+20000;while(Date.now()<end){if(fn())return;await new Promise(r=>setTimeout(r,50));}throw Error('Timed out');};
try{
 const failure=submitImage({prompt:'safe test',detail_mode:'8k'});startNext(launch(true));await wait(()=>readJob(failure.id).status==='failed');
 assert.ok(fs.existsSync(path.join(jobDir(failure.id),'base.png')));assert.match(readJob(failure.id).error,/基础图已保留/);assert.ok(!fs.existsSync(path.join(jobs,'active.lock')));
 const cancelled=submitImage({prompt:'safe test',detail_mode:'8k'});startNext(launch(false));await wait(()=>readJob(cancelled.id).enhanceProgress?.step===2);
 deleteJob(cancelled.id);await wait(()=>!fs.existsSync(jobDir(cancelled.id)));assert.ok(!fs.existsSync(path.join(jobs,'active.lock')));
 console.log('PASS: real worker preserves base on enhancement failure and cancels an unresponsive enhancement child');
}finally{for(const c of children)c.kill('SIGKILL');fs.rmSync(data,{recursive:true,force:true});}
