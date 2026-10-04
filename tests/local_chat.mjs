import {sessionCookie,authDirectory,authenticatedFetch as fetch} from './auth_fixture.mjs';
import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import { once } from 'node:events';
import { createGallery } from '../src/image_gallery.mjs';
import { readChatStream } from '../src/local_chat_stream.mjs';

let received,upstreamAborted=false;
const upstream=http.createServer(async(req,res)=>{
  const chunks=[];for await(const chunk of req)chunks.push(chunk);received=JSON.parse(Buffer.concat(chunks));
  res.writeHead(200,{'Content-Type':'text/event-stream'});
  if(received.messages.at(-1)?.content==='abort-stream') {res.write('data: {"choices":[{"delta":{"content":"started"}}]}\n\n');await new Promise(resolve=>res.once('close',()=>{upstreamAborted=true;resolve();}));return;}
  if(received.messages.at(-1)?.content==='break-stream') {res.write('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n');setImmediate(()=>res.destroy());return;}
  res.end('data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n');
});
upstream.listen(0,'127.0.0.1');await once(upstream,'listening');
const port=18136,server=createGallery({authDirectory,port,schedule:false,chatBaseUrl:`http://127.0.0.1:${upstream.address().port}/v1`});
server.listen(port,'127.0.0.1');await once(server,'listening');
const base=`http://127.0.0.1:${port}`;
const rawGetWithHost=(host,identity=false)=>new Promise((resolve,reject)=>http.get({hostname:'127.0.0.1',port,path:'/edit',headers:{Cookie:sessionCookie(),Host:host,...(identity?{'Tailscale-User-Login':'local-test@example.com'}:{})}},response=>{response.resume();response.on('end',()=>resolve(response.statusCode));}).on('error',reject));
const rawPostWithHost=(host,origin,body,identity=false)=>new Promise((resolve,reject)=>{const payload=JSON.stringify(body);const request=http.request({hostname:'127.0.0.1',port,path:'/api/chat',method:'POST',headers:{Cookie:sessionCookie(),Host:host,Origin:origin,'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload),...(identity?{'Tailscale-User-Login':'local-test@example.com'}:{})}},response=>{let text='';response.setEncoding('utf8');response.on('data',chunk=>text+=chunk);response.on('end',()=>resolve({status:response.statusCode,text}));});request.on('error',reject);request.end(payload);});
try{
  const page=await fetch(`${base}/chat`);assert.equal(page.status,200);const pageHtml=await page.text();assert.match(pageHtml,/本地 Qwen 对话/);assert.match(pageHtml,/href="\/edit"[^>]*>图片生成/);assert.match(pageHtml,/id="history-list"/);assert.match(pageHtml,/id="queue-state"/);assert.match(pageHtml,/不会自动排队/);
  const lanAddress=Object.values(os.networkInterfaces()).flat().find(entry=>entry?.family==='IPv4'&&!entry.internal&&(/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(entry.address)))?.address;
  const tailscaleAddress=Object.values(os.networkInterfaces()).flat().find(entry=>entry?.family==='IPv4'&&!entry.internal&&/^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\./.test(entry.address))?.address;
  if(lanAddress)assert.equal(await rawGetWithHost(`${lanAddress}:${port}`),200);
  assert.equal(await rawGetWithHost(`attacker.example:${port}`),403);
  if(tailscaleAddress)assert.equal(await rawGetWithHost(`${tailscaleAddress}:${port}`),200);
  const imagePage=await fetch(`${base}/edit`);assert.equal(imagePage.status,200);assert.match(await imagePage.text(),/href="\/chat"[^>]*>文字对话/);
  const js=await fetch(`${base}/chat.js`);assert.equal(js.status,200);const chatScript=await js.text();assert.match(chatScript,/copy-reply/);assert.match(chatScript,/navigator\.clipboard/);assert.match(chatScript,/execCommand\('copy'\)/);assert.match(chatScript,/qwen-chat-sessions/);assert.match(chatScript,/localStorage\.setItem\(storageKey/);assert.match(chatScript,/function openSession/);assert.match(chatScript,/正在生成 1 项 · 等待 0 项/);
  const streamModule=await fetch(`${base}/chat_stream.mjs`);assert.equal(streamModule.status,200);assert.match(await streamModule.text(),/readChatStream/);
  assert.match(pageHtml,/id="response-mode"/);assert.match(pageHtml,/快速 · 最多约1千词元/);assert.match(pageHtml,/详细 · 最多约8千词元/);assert.match(pageHtml,/value="detailed" selected/);assert.match(pageHtml,/回车发送/);assert.match(pageHtml,/上下文约3\.2万词元/);assert.doesNotMatch(pageHtml,/Shift|最多约\d+K token/i);
  const response=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'你好'}]})});
  assert.equal(response.status,200);assert.match(await response.text(),/你好/);assert.equal(received.model,'qwen3.8-27b-local');assert.equal(received.stream,true);assert.equal(received.max_tokens,4096);assert.equal(received.messages[0].role,'system');assert.match(received.messages[0].content,/始终使用简体中文/);assert.deepEqual(received.messages[1],{role:'user',content:'你好'});
  for(const [responseMode,maxTokens] of [['fast',1024],['detailed',8192]]){const selected=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'你好'}],responseMode})});assert.equal(selected.status,200);await selected.text();assert.equal(received.max_tokens,maxTokens);}
  const maximum=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'你好'}],responseMode:'maximum'})});assert.equal(maximum.status,200);await maximum.text();assert.ok(received.max_tokens>8192&&received.max_tokens<32768);assert.match(received.messages[0].content,/极限详细/);
  const direct=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'你好'}],thinking:false})});await direct.text();assert.equal(received.chat_template_kwargs.enable_thinking,false);assert.equal(received.reasoning_effort,'none');
  const invalidMode=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'你好'}],responseMode:'unlimited'})});assert.equal(invalidMode.status,400);
  const aborter=new AbortController();const pending=fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'abort-stream'}]}),signal:aborter.signal});const pendingResponse=await pending;const pendingReader=pendingResponse.body.getReader();assert.match(new TextDecoder().decode((await pendingReader.read()).value),/started/);aborter.abort();await assert.rejects(pendingReader.read());for(let i=0;i<20&&!upstreamAborted;i++)await new Promise(resolve=>setTimeout(resolve,10));assert.equal(upstreamAborted,true,'browser cancellation must abort the LM Studio upstream request');
  let shown='';const emptyAfterReasoning=new Response('data: {"choices":[{"delta":{"reasoning_content":"thinking only"}}]}\n\ndata: {"choices":[{"delta":{},"finish_reason":"length"}]}\n\ndata: [DONE]');
  await assert.rejects(readChatStream(emptyAfterReasoning,{onText:text=>shown=text}),/用完了本次输出长度/);assert.equal(shown,'');
  const visible=new Response('data: {"choices":[{"delta":{"content":"正文"},"finish_reason":"stop"}]}');
  assert.equal(await readChatStream(visible), '正文');
  const longHistory=Array.from({length:8},(_,i)=>({role:i%2?'assistant':'user',content:`m${i}:`+'x'.repeat(5000)}));longHistory.push({role:'user',content:'最新问题'});
  const bounded=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:longHistory})});
  assert.equal(bounded.status,200);await bounded.text();assert.ok(received.messages.length< longHistory.length+1);assert.ok(received.messages.slice(1).reduce((n,m)=>n+m.content.length,0)<=24000);assert.equal(received.messages.at(-1).content,'最新问题');
  const interrupted=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'break-stream'}]})});
  const interruptedText=await interrupted.text();assert.equal(interrupted.status,200);assert.match(interruptedText,/partial/);assert.match(interruptedText,/"error"/);
  const recovered=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'你好'}]})});
  assert.equal(recovered.status,200);assert.match(await recovered.text(),/你好/);
  const invalid=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'system',content:'bad'}]})});
  assert.equal(invalid.status,400);
  const foreign=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:'http://evil.test','Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'x'}]})});
  assert.equal(foreign.status,403);
  if(lanAddress){const lanOrigin=`http://${lanAddress}:${port}`;const sameLan=await rawPostWithHost(`${lanAddress}:${port}`,lanOrigin,{messages:[{role:'user',content:'你好'}]});assert.equal(sameLan.status,200);assert.match(sameLan.text,/你好/);}
  if(tailscaleAddress){const tailnetOrigin=`http://${tailscaleAddress}:${port}`;const tailnetPost=await rawPostWithHost(`${tailscaleAddress}:${port}`,tailnetOrigin,{messages:[{role:'user',content:'你好'}]});assert.equal(tailnetPost.status,200);assert.match(tailnetPost.text,/你好/);}
  console.log('Local chat route, fixed model proxy, SSE stream, and input/origin validation passed.');
}finally{server.close();upstream.close();}
