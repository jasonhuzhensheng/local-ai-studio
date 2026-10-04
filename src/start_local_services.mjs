import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const execute=promisify(execFile);
const home=os.homedir();
export async function startServices({run=async(file,args)=>{
 const {stdout}=await execute(file,args,{timeout:args[0]==='load'?180000:20000,maxBuffer:4*1024*1024});return stdout;
},mkdir=dir=>fs.mkdir(dir,{recursive:true}),check=async url=>{
 try{return (await fetch(url,{signal:AbortSignal.timeout(5000)})).ok;}catch{return false;}
}}={}){
 const lms=path.join(home,'.lmstudio/bin/lms'),ts='/Applications/Tailscale.app/Contents/MacOS/Tailscale';
 const domain=`gui/${process.getuid()}`;
 const failures=[];
 // Independent services must still recover when one component is unavailable.
 try{
  const status=await run('/usr/sbin/scutil',['--nc','status','Tailscale']);
  if(!status.startsWith('Connected')){
   await run('/usr/bin/open',['-g','-a','Tailscale']);
   await run('/usr/sbin/scutil',['--nc','start','Tailscale']);
   if(!(await run('/usr/sbin/scutil',['--nc','status','Tailscale'])).startsWith('Connected'))throw Error('VPN not ready');
  }
 }catch{failures.push('Tailscale启动失败');}
 try{
  try{await run('/bin/launchctl',['print',`${domain}/com.codex.local-image-gallery`]);}
  catch{await run('/bin/launchctl',['bootstrap',domain,path.join(home,'Library/LaunchAgents/com.codex.local-image-gallery.plist')]);}
  if(!await check('http://127.0.0.1:1235/chat'))throw Error('not ready');
 }catch{failures.push('网页尚未就绪');}
 try{
  if(!await check('http://127.0.0.1:1234/v1/models')){
   await run('/usr/bin/open',['-g','-a','LM Studio']);
   await run(lms,['server','start','--port','1234']);
  }
  // LM Studio startup may remove its temp directory; create it after startup.
  await mkdir(path.join(home,'.lmstudio/.internal/temp'));
  const raw=await run(lms,['ps','--json']);
  const models=JSON.parse(raw.slice(raw.indexOf('[')));
  if(!models.some(m=>m.identifier==='qwen3.8-27b-local')){
   await run(lms,['load','huihui-qwen3.8-27b-abliterated','--identifier','qwen3.8-27b-local','--context-length','32768','--parallel','4','-y']);
  }
  const verified=await run(lms,['ps','--json']);
  if(!JSON.parse(verified.slice(verified.indexOf('['))).some(m=>m.identifier==='qwen3.8-27b-local'))throw Error('model missing');
 }catch{failures.push('文字服务或模型尚未就绪');}
 if(failures.length)throw Error(failures.join('；'));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 startServices().then(()=>console.log(new Date().toISOString(),'登录启动完成')).catch(e=>{console.error(new Date().toISOString(),e.message);process.exitCode=1;});
}
