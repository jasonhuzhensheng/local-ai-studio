import {readChatStream} from './chat_stream.mjs';

const $=id=>document.getElementById(id),messages=$('messages'),storageKey='qwen-chat-sessions';
let sessions=loadSessions(),activeId=localStorage.getItem('qwen-active-chat'),history=[],busy=false,activeController=null;
const savedResponseMode=localStorage.getItem('qwen-response-mode');if(['fast','standard','detailed','maximum'].includes(savedResponseMode))$('response-mode').value=savedResponseMode;
function loadSessions(){try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(value)?value.filter(s=>s&&typeof s.id==='string'&&Array.isArray(s.messages)):[]}catch{return[]}}
function saveSessions(){try{let value=sessions.slice(0,20);while(value.length&&JSON.stringify(value).length>1500000)value.pop();sessions=value;localStorage.setItem(storageKey,JSON.stringify(sessions));}catch{$('storage-note').textContent='本机历史存储空间不足；较早记录可能未保存。'}}
function newId(){
  if(typeof globalThis.crypto?.randomUUID==='function')return globalThis.crypto.randomUUID();
  if(typeof globalThis.crypto?.getRandomValues!=='function')throw Error('浏览器不支持安全随机数，请使用新版 Safari 或 Chrome。');
  const bytes=new Uint8Array(16);globalThis.crypto.getRandomValues(bytes);
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function activeSession(){return sessions.find(session=>session.id===activeId)}
function renderList(){
  const list=$('history-list');list.replaceChildren();
  if(!sessions.length){list.append(Object.assign(document.createElement('p'),{className:'history-empty',textContent:'还没有历史对话'}));return;}
  for(const session of sessions){const button=document.createElement('button');button.type='button';button.className=`history-item${session.id===activeId?' selected':''}`;button.disabled=busy;button.onclick=()=>openSession(session.id);const title=document.createElement('span');title.className='history-title';title.textContent=session.title||'新对话';const state=document.createElement('span');state.className=`history-state ${session.status||'completed'}`;state.textContent=session.id===activeId&&busy?'生成中':({failed:'失败',stopped:'已停止',completed:'已完成'}[session.status]||'已完成');button.append(title,state);list.append(button);}
}
function renderTranscript(){messages.replaceChildren();if(!history.length){messages.append(Object.assign(document.createElement('div'),{className:'empty',textContent:'输入问题开始对话'}));return;}for(const [index,item] of history.entries())bubble(item.role,item.content,false,index);}
function openSession(id){if(busy)return;const session=sessions.find(item=>item.id===id);if(!session)return;activeId=id;history=session.messages.map(item=>({...item}));localStorage.setItem('qwen-active-chat',id);renderTranscript();renderList();$('status').textContent='本地模型 · 上下文约3.2万词元';$('input').focus();}
function beginNewSession(){if(busy)return;activeId=null;history=[];localStorage.removeItem('qwen-active-chat');renderTranscript();renderList();$('input').focus();}
function ensureSession(firstMessage){if(activeSession())return activeSession();const session={id:newId(),title:firstMessage.replace(/\s+/g,' ').slice(0,48),messages:[],status:'running',updatedAt:Date.now()};activeId=session.id;sessions.unshift(session);localStorage.setItem('qwen-active-chat',activeId);return session;}
function persist(status){const session=activeSession();if(!session)return;session.messages=session.taskId?history.slice():history.slice(-48);session.status=status;session.updatedAt=Date.now();sessions.sort((a,b)=>b.updatedAt-a.updatedAt);saveSessions();renderList();$('queue-state').textContent=busy?'正在生成 1 项 · 等待 0 项':'当前无生成任务 · 等待 0 项';}
function deleteTurn(index){
  if(busy)return;
  if(!window.confirm(window.StudioI18n.t("确定删除本次提问和回答吗？删除后无法恢复。")))return;
  const start=(!history[index]||history[index].role==='assistant')&&history[index-1]?.role==='user'?index-1:index;
  const count=history[start]?.role==='user'&&history[start+1]?.role==='assistant'?2:1;
  history.splice(start,count);
  if(!history.length){sessions=sessions.filter(s=>s.id!==activeId);saveSessions();beginNewSession();}
  else{const session=activeSession();session.title=history.find(m=>m.role==='user')?.content.replace(/\s+/g,' ').slice(0,48)||'对话';persist(session.status);renderTranscript();}
}
function bubble(role,text,pending=false,index=history.length){
  const row=document.createElement('article');row.className=`message ${role}`;const avatar=document.createElement('div');avatar.className='avatar';avatar.textContent=role==='user'?'我':'Q';const content=document.createElement('div');content.className='bubble';content.textContent=text;if(pending)content.classList.add('pending');let copyButton=null;
  if(role==='assistant'){
    const wrap=document.createElement('div');wrap.className='reply-wrap';copyButton=document.createElement('button');copyButton.type='button';copyButton.className='copy-reply';copyButton.textContent='复制';copyButton.setAttribute('aria-label','复制助手回复');copyButton.disabled=!text.trim();copyButton.onclick=async()=>{const answer=content.textContent.replace(/\n\n（已停止生成）$/,'').trim();if(!answer)return;try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(answer);else{const field=document.createElement('textarea');field.value=answer;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw Error('复制不可用');}copyButton.textContent='已复制';setTimeout(()=>{if(copyButton.isConnected)copyButton.textContent='复制';},1600);}catch{copyButton.textContent='复制失败';setTimeout(()=>{if(copyButton.isConnected)copyButton.textContent='复制';},1800);}};const actions=document.createElement('div');actions.className='reply-actions';const remove=document.createElement('button');remove.type='button';remove.className='delete-reply';remove.textContent='删除任务';remove.title='删除本次提问和回答';remove.disabled=busy||pending;remove.onclick=()=>deleteTurn(index);actions.append(copyButton,remove);wrap.append(content,actions);row.append(avatar,wrap);
  }else row.append(avatar,content);
  messages.append(row);messages.querySelector('.empty')?.remove();row.scrollIntoView({block:'nearest'});return {content,copyButton};
}
function setBusy(value){busy=value;$('thinking-mode').disabled=value;$('response-mode').disabled=value;messages.querySelectorAll('.delete-reply').forEach(button=>button.disabled=value);$('send').disabled=value;$('stop').hidden=!value;$('stop').disabled=false;$('input').disabled=value;$('clear').disabled=value;$('status').textContent=value?'本地模型正在思考…':'本地模型 · 上下文约3.2万词元';$('queue-state').textContent=value?'正在生成 1 项 · 等待 0 项':'当前无生成任务 · 等待 0 项';renderList();}
renderList();if(activeId&&sessions.some(session=>session.id===activeId)){history=activeSession().messages.map(item=>({...item}));renderTranscript();}else{activeId=null;history=[];renderTranscript();}
$('response-mode').onchange=()=>localStorage.setItem('qwen-response-mode',$('response-mode').value);
async function followTask(session){
  setBusy(true);
  const index=session.taskIndex;
  // Rebuild once on reconnect, then update only this answer while polling.
  renderTranscript();
  let view;
  if(history[index]?.role==='assistant'){
    const row=messages.children[index];view={content:row.querySelector('.bubble'),copyButton:row.querySelector('.copy-reply')};
  }else view=bubble('assistant','',true,index);
  view.copyButton.disabled=!history[index]?.content;
  let failures=0;$('queue-state').textContent=`文字任务编号：${session.taskId}`;
  try{
    if(session.taskRequest){
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(session.taskRequest)});
      if(!response.ok){const data=await response.json();throw Error(data.error||'任务提交失败');}
      delete session.taskRequest;saveSessions();
    }
    while(true){
      let response;
      try{response=await fetch(`/api/chat-tasks/${session.taskId}`,{signal:AbortSignal.timeout(15000),cache:'no-store'});if(!response.ok)throw Error(response.status===404?'文字服务已重启，原任务无法继续。':`查询失败（${response.status}）`);}
      catch(error){if(error.message.includes('已重启'))throw error;failures++;view.content.classList.remove('pending');if(view.copyButton.disabled)view.content.textContent='任务进度连接中断，正在重新连接；这不表示模型仍在分析。';$('status').textContent=`连接重试 ${failures} · 任务 ${session.taskId}`;await new Promise(r=>setTimeout(r,2000));continue;}
      failures=0;const task=await response.json();
      if(task.text){history[index]={role:'assistant',content:task.text};view.content.textContent=task.text;view.copyButton.disabled=false;view.content.classList.remove('pending');}
      else view.content.textContent=task.reasoning?'模型正在分析，正文尚未开始…':'后台任务已提交，正在等待模型…';
      $('status').textContent=`${task.text?'正在生成回答':task.reasoning?'模型正在分析':'等待模型'} · ${Math.floor((Date.now()-task.startedAt)/1000)}秒`;
      persist(task.status);$('queue-state').textContent=`文字任务编号：${session.taskId} · ${task.status==='running'?'运行中':task.status==='completed'?'已完成':task.status==='stopped'?'已停止':'失败'}`;
      if(task.status!=='running'){
        session.status=task.status;
        if(task.status==='failed')throw Error(task.error||'生成失败');
        if(task.status==='stopped')view.content.textContent=task.text?`${task.text}\n\n（已停止生成）`:'已停止生成。';
        delete session.taskId;delete session.taskIndex;break;
      }
      await new Promise(r=>setTimeout(r,700));
    }
  }catch(error){view.content.textContent=`本地模型请求失败：${error.message}`;view.copyButton.disabled=true;session.status='failed';delete session.taskId;delete session.taskIndex;delete session.taskRequest;}
  finally{view.content.classList.remove('pending');setBusy(false);persist(session.status);$('input').focus();}
}
$('form').onsubmit=async e=>{
  e.preventDefault();if(busy)return;const text=$('input').value.trim();if(!text)return;
  try{
  const taskId=newId();const session=ensureSession(text);history.push({role:'user',content:text});$('input').value='';
  session.taskId=taskId;session.taskIndex=history.length;
  session.taskRequest={background:true,taskId:session.taskId,messages:history.map(m=>({...m})),responseMode:$('response-mode').value,thinking:$('thinking-mode').value==='on'};
  persist('running');await followTask(session);
  }catch(error){$('status').textContent=`发送失败：${error.message}`;setBusy(false);$('status').textContent=`发送失败：${error.message}`;}
};
$('stop').onclick=async()=>{
  const session=activeSession();if(!session?.taskId)return;
  $('stop').disabled=true;
  try{const r=await fetch(`/api/chat-tasks/${session.taskId}/stop`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw Error('停止失败');$('status').textContent='正在停止生成…';}
  catch{$('stop').disabled=false;$('status').textContent='停止请求失败，请重试';}
};
if(activeSession()?.taskId)void followTask(activeSession());
$('input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();$('form').requestSubmit();}};
$('clear').onclick=beginNewSession;
