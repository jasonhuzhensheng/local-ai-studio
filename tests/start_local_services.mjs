import assert from 'node:assert/strict';
import {startServices} from '../src/start_local_services.mjs';
for(const cold of [false,true]){
 const calls=[];let loaded=false,vpn=false;
 await startServices({check:async()=>!cold,mkdir:async()=>calls.push('mkdir'),run:async(file,args)=>{
  calls.push(args.join(' '));
  if(args[0]==='--nc'&&args[1]==='start')vpn=true;
  if(args[0]==='--nc'&&args[1]==='status')return !cold||vpn?'Connected':'Disconnected';
  if(args[0]==='print'&&cold)throw Error('absent');
  if(args[0]==='load')loaded=true;
  if(args[0]==='ps')return JSON.stringify(cold&&!loaded?[]:[{identifier:'qwen3.8-27b-local'}]);
  return '';
 }}).catch(e=>{if(!cold)throw e;assert.match(e.message,/网页尚未就绪/);});
 assert.equal(calls.some(x=>x.startsWith('load ')),cold);
 assert.equal(calls.includes('--nc start Tailscale'),cold);
 assert.equal(calls.some(x=>x.startsWith('bootstrap ')),cold);
 assert.ok(!calls.some(x=>/unload|kickstart|down/.test(x)));
 if(cold)assert.ok(calls.indexOf('mkdir')>calls.indexOf('server start --port 1234'));
}
console.log('PASS: warm startup is non-disruptive; cold startup restores independent services; temp directory created after LM startup');
