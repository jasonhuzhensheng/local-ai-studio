import {authDirectory,authenticatedFetch as fetch} from './auth_fixture.mjs';
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import {randomUUID} from 'node:crypto';
import {createGallery} from '../src/image_gallery.mjs';
let calls=0,aborted=false;
const upstream=http.createServer(async(req,res)=>{
 let body='';for await(const c of req)body+=c;
 const slow=JSON.parse(body).messages.at(-1).content==='slow';calls++;
 res.writeHead(200,{'Content-Type':'text/event-stream'});
 res.write('data: {"choices":[{"delta":{"content":"第一段"}}]}\n\n');
 if(slow){await new Promise(resolve=>res.on('close',()=>{aborted=true;resolve()}));return;}
 await new Promise(r=>setTimeout(r,300));
 res.end('data: {"choices":[{"delta":{"content":"第二段"}}]}\n\ndata: [DONE]\n\n');
});upstream.listen(0,'127.0.0.1');await once(upstream,'listening');
const base='http://127.0.0.1:18139';
const server=createGallery({authDirectory,port:18139,schedule:false,chatBaseUrl:`http://127.0.0.1:${upstream.address().port}/v1`});server.listen(18139,'127.0.0.1');await once(server,'listening');
const post=(url,body)=>fetch(base+url,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(body)});
const wait=async id=>{for(let i=0;i<100;i++){const t=await(await fetch(`${base}/api/chat-tasks/${id}`)).json();if(t.status!=='running')return t;await new Promise(r=>setTimeout(r,20));}throw Error('timeout');};
try{
 const id=randomUUID(),body={background:true,taskId:id,messages:[{role:'user',content:'test'}]};
 const r=await post('/api/chat',body);assert.equal(r.status,202);await r.json();
 // The initial connection is over. A new client reconnects using the same ID.
 await(await post('/api/chat',body)).json();
 const completed=await wait(id);assert.equal(completed.text,'第一段第二段');assert.equal(completed.status,'completed');assert.equal(calls,1);
 const stopId=randomUUID();await(await post('/api/chat',{...body,taskId:stopId,messages:[{role:'user',content:'slow'}]})).json();
 await new Promise(r=>setTimeout(r,50));await(await post(`/api/chat-tasks/${stopId}/stop`,{})).json();
 assert.equal((await wait(stopId)).status,'stopped');await new Promise(r=>setTimeout(r,50));assert.ok(aborted);
 console.log('PASS: disconnected client continues, reconnect has full result, duplicate submission is idempotent, explicit stop aborts upstream');
}finally{server.close();upstream.close();server.closeAllConnections();upstream.closeAllConnections();}
