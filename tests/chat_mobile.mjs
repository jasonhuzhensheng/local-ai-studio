import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const source=fs.readFileSync(new URL('../src/local_chat.js',import.meta.url),'utf8');
const idCode=source.slice(source.indexOf('function newId()'),source.indexOf('function activeSession()'));
const handler=source.slice(source.indexOf("$('form').onsubmit="),source.indexOf("$('stop').onclick="));
for(const secure of [true,false]){
 const elements={form:{},input:{value:'独立测试'},'response-mode':{value:'fast'},'thinking-mode':{value:'off'},status:{}};
 const session={};let submitted=false;
 const ctx={crypto:secure?webcrypto:{getRandomValues:a=>webcrypto.getRandomValues(a)},Uint8Array,$:id=>elements[id],busy:false,history:[],ensureSession:()=>{session.id=vm.runInContext('newId()',ctx);return session;},persist(){},setBusy(){},followTask:async s=>{assert.equal(s.taskRequest.messages[0].content,'独立测试');submitted=true;}};
 vm.createContext(ctx);vm.runInContext(idCode+handler,ctx);
 await elements.form.onsubmit({preventDefault(){}});
 assert.ok(submitted);assert.match(session.taskId,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);assert.notEqual(session.id,session.taskId);
}
console.log('PASS: secure localhost and HTTP IP browser submit valid distinct session/task UUIDs without randomUUID');
