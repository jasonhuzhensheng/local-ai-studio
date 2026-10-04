import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/local_chat.js',import.meta.url),'utf8');
const fn=source.slice(source.indexOf('function deleteTurn('),source.indexOf('function bubble('));
for(const [history,index,expected] of [
 [[{role:'user',content:'a'},{role:'assistant',content:'b'},{role:'user',content:'c'},{role:'assistant',content:'d'}],1,2],
 [[{role:'user',content:'a'},{role:'assistant',content:'b'}],1,0],
 [[{role:'user',content:'failed'}],1,0]
]){
 const session={id:'test',messages:history};
 const context={window:{confirm:()=>true},history,index,busy:false,activeId:'test',sessions:[session],activeSession:()=>session,saveSessions(){},beginNewSession(){},persist(){session.messages=context.history.slice()},renderTranscript(){}};
 vm.createContext(context);vm.runInContext(fn+';deleteTurn(index)',context);
 assert.equal(context.history.length,expected);
 if(!expected)assert.equal(context.sessions.length,0);
 else assert.equal(context.history[0].content,'c');
}
console.log('PASS: delete one turn, preserve other turns, delete final session, remove failed turn');

const retained=[{role:'user',content:'keep'},{role:'assistant',content:'keep answer'}];
const cancelled={busy:false,history:retained,window:{confirm:()=>false}};
vm.createContext(cancelled);vm.runInContext(fn+';deleteTurn(1)',cancelled);
assert.equal(retained.length,2);
console.log('PASS: cancelling confirmation preserves messages');
