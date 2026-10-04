export async function readChatStream(response,{onText=()=>{},onReasoning=()=>{}}={}){
  if(!response.body)throw Error('本地模型返回了空响应流。请确认 LM Studio 已加载 Qwen3.8 并启动本地服务器。');
  const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',answer='',finishReason=null,sawReasoning=false,sawPacket=false;
  const consume=line=>{
    if(!line.startsWith('data:'))return;
    const data=line.slice(5).trim();if(!data||data==='[DONE]')return;
    let packet;try{packet=JSON.parse(data);}catch{return;}
    if(packet.error)throw Error(packet.error.message||'LM Studio 返回生成错误');
    sawPacket=true;const choice=packet.choices?.[0];if(choice?.finish_reason)finishReason=choice.finish_reason;
    const delta=choice?.delta||{};
    if(typeof delta.content==='string'&&delta.content){answer+=delta.content;onText(answer);}
    if(delta.reasoning_content||delta.reasoning){sawReasoning=true;onReasoning();}
  };
  while(true){
    const {value,done}=await reader.read();
    buffer+=decoder.decode(value||new Uint8Array(),{stream:!done});
    const lines=buffer.split('\n');buffer=lines.pop()||'';
    if(done&&buffer.trim())lines.push(buffer);
    for(const line of lines)consume(line);
    if(done)break;
  }
  if(!answer){
    if(finishReason==='length')throw Error('模型用完了本次输出长度，但没生成可显示的正文。请点“新对话”并拆成较短的问题。');
    if(sawReasoning)throw Error('模型完成了思考，但没有生成可显示的正文。请点“新对话”缩短上下文，或把任务拆成几段。');
    if(!sawPacket)throw Error('LM Studio 返回了空响应，没有收到生成内容。请确认模型仍已加载后重试。');
    throw Error(`模型结束了回复，但没有正文${finishReason?`（结束原因：${finishReason}）`:''}。请点“新对话”后重试。`);
  }
  return answer;
}
