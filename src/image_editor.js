import {outputDimensions,MAX_IMAGE_PIXELS} from './image_dimensions.mjs';
const $ = id => document.getElementById(id);
const refs=[];
let compositionChosen=false;
const presets = [[512,512],[768,1536],[768,768],[1024,1024],[768,1024],[1024,768],[1344,768],[768,1344],[1536,1024],[1024,1536],[1536,1536],[2048,2048],[2400,1792],[1792,2400],[2528,1696],[1696,2528],[2752,1536],[1536,2752],[1248,2688],[2560,1600]];
for (const [w,h] of presets) {
  const o=document.createElement('option');o.value=`${w}x${h}`;
  o.textContent=`${w} × ${h}${w===512?' · 快速预览':w===2048?' · 2K 方图':w===1248?' · iPhone 壁纸':w===2560?' · MacBook 壁纸':''}`;$('size').append(o);
}
function outputSize(){
 const [w,h]=$('size').value.split('x').map(Number);
 const reference=refs[0],model=$('model-id').value,wai=model==='wai-illustrious-v17';
 return outputDimensions({baseWidth:w,baseHeight:h,composition:$('composition').value,referenceWidth:reference?.width,referenceHeight:reference?.height,preview:$('render-size').value==='preview',maxPixels:wai?2097152:MAX_IMAGE_PIXELS});
}
function ratioNote(){
 const note=$('ratio-note');note.textContent='';
 const reference=refs[0];if(!reference?.width||!reference?.height)return;
 let w,h;try{[w,h]=outputSize();}catch{return;}
 const ratio=reference.width/reference.height;
 if(Math.abs((w/h)/ratio-1)>0.03)note.textContent=`参考图1为 ${reference.width} × ${reference.height}，本次输出 ${w} × ${h}，比例不同，人物和构图可能重新绘制。`;
}
function sizeNote(){
 let w,h;try{[w,h]=outputSize();}catch(e){$('size-note').textContent=e.message;ratioNote();return;}
 const detail=$('detail-mode').value==='8k',draft=$('render-size').value==='preview',composition=$('composition').value;
 $('size-note').textContent=detail?`先生成 ${w} × ${h} 基础图，再分块增强至长边7680，保持基础图比例。基础细节越丰富，放大效果通常越好。`:draft?`本次实际生成 ${w} × ${h} 试图，尽量保持所选比例（32像素对齐可能略有偏差），不会放大成正式图。满意后切回“正式尺寸”再生成。`:`实际生成 ${w} × ${h}，非生成后放大。大图每步可能需要数分钟。`;
 if(composition==='reference'&&refs.length===0)$('composition-note').textContent='请先添加参考图1；实际输出尺寸会按图1比例自动计算。';
 else if(composition==='reference')$('composition-note').textContent=`按图1比例计算尺寸；当前预算下实际输出 ${w} × ${h}。`;
 else if(composition==='tall')$('composition-note').textContent=`超长竖幅固定约1:3；当前预算下实际输出 ${w} × ${h}。`;
 else if(composition==='wide')$('composition-note').textContent=`超宽横幅固定约3:1；当前预算下实际输出 ${w} × ${h}。`;
 else $('composition-note').textContent='按分辨率预设比例生成；选择“跟随参考图1”可自动匹配图1宽高比。';
 ratioNote();
}
$('detail-mode').onchange=()=>{const detail=$('detail-mode').value==='8k';$('render-size').disabled=detail;if(detail)$('render-size').value='full';sizeNote();};
$('size').onchange=sizeNote;$('render-size').onchange=sizeNote;$('composition').onchange=()=>{compositionChosen=true;sizeNote();};sizeNote();
const speedNotes={balanced:'均衡方案在384×512人物样张上用时2分24秒，比原设置减少54%。不会改变尺寸或步数。',fast:'384×512人物样张实测1分29秒，比原设置减少72%；皮肤和布料纹理更粗，适合预览。反向提示词不参与计算；尺寸和步数不变。',original:'关闭缓存，使用标准CFG和反向提示词；适合画质对照。',custom:'使用更多参数中的自定义设置。'};
$('speed-preset').onchange=()=>{const mode=$('speed-preset').value;$('cache-mode').value=mode==='original'?'none':'easycache';$('cfg-scale').value=mode==='fast'?'1':'6';$('speed-note').textContent=speedNotes[mode];};
for(const id of ['cache-mode','cfg-scale']) $(id).addEventListener('change',()=>{$('speed-preset').value='custom';$('speed-note').textContent=speedNotes.custom+($('cfg-scale').value==='1'?' 当前CFG1不使用反向提示词。':'');});
let preparing=false, submitting=false, allJobs=[], limit=30, refreshing=false;
const cards=new Map();
function message(text){$('status').textContent=text;}
function button(text,action,cls=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=action;return b;}
function previewMode(actual){
 $('lightbox').classList.toggle('actual-size',actual);
 $('preview-fit').setAttribute('aria-pressed',String(!actual));$('preview-actual').setAttribute('aria-pressed',String(actual));
 $('preview-viewport').scrollTo(0,0);
}
function preview(src){previewMode(false);$('preview-info').textContent='正在加载…';$('large-image').src=src;$('lightbox').showModal();}
$('preview-fit').onclick=()=>previewMode(false);
$('preview-actual').onclick=()=>previewMode(true);
$('large-image').onload=()=>{$('preview-info').textContent=`${$('large-image').naturalWidth} × ${$('large-image').naturalHeight} · 1:1按图片像素显示（CSS像素）`;};
$('large-image').onerror=()=>{$('preview-info').textContent='图片无法加载，可能已被删除';};
$('close-lightbox').onclick=()=>$('lightbox').close();
$('lightbox').onclick=e=>{if(e.target===$('lightbox'))$('lightbox').close();};
const referenceLimit=()=>$('model-id').value.startsWith('viggle-qwen-image-2.1-v0.3')?3:10;
function drawRefs(){
  // Preserve explicit canvas choices; default new reference edits to their own ratio.
  if(!compositionChosen)$('composition').value=refs.length?'reference':'preset';
  $('references').replaceChildren();sizeNote();
  refs.forEach((r,i)=>{const f=document.createElement('figure');f.className='ref';const img=document.createElement('img');img.onload=ratioNote;img.src=r.png||r.url;img.alt=`参考图 ${i+1}`;img.onclick=()=>preview(img.src);const c=document.createElement('figcaption');c.textContent=`图 ${i+1}`;f.append(img,c,button('移除',()=>{if(preparing||submitting)return;refs.splice(i,1);drawRefs();}));$('references').append(f);});
}
$('file').onchange=async()=>{
  if(preparing||submitting)return;
  preparing=true;$('submit').disabled=true;
  try{
    const files=[...$('file').files];if(refs.length+files.length>referenceLimit())throw Error(`此模型最多选择${referenceLimit()}张参考图片，请先移除不需要的图片`);
    const staged=[];
    for(const f of files){
      if(f.size>20000000)throw Error('每张图片最多20MB');
      let bitmap;try{bitmap=await createImageBitmap(f);}catch{throw Error('无法读取图片，请确认文件仍存在且为有效的PNG、JPEG或WebP图片');}
      try{const scale=Math.min(1,1024/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);staged.push({png:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height});}finally{bitmap.close();}
    }
    refs.push(...staged);drawRefs();message(`已选择 ${refs.length} 张参考图`);
  }catch(e){message(e.message);}finally{preparing=false;$('submit').disabled=false;$('file').value='';}
};
async function api(url,body){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await r.json();if(!r.ok)throw Error(result.error||'请求失败');return result;}
$('form').onsubmit=async e=>{
  e.preventDefault();if(preparing||submitting)return;submitting=true;$('submit').disabled=true;$('file').disabled=true;message('正在保存图片并提交任务…');
  try{
    if(refs.length>referenceLimit())throw Error(`此模型最多支持${referenceLimit()}张参考图，请先移除多余参考图`);
    if($('model-id').value==='wai-illustrious-v17'&&refs.length)throw Error('请移除参考图，或切换 Qwen 进行参考图编辑');
    if($('composition').value==='reference'&&!refs[0])throw Error('选择“跟随参考图1”前，请先添加参考图');
    for(const r of refs)if(!r.id)r.id=(await api('/api/references',{data:r.png.split(',')[1]})).id;
    const [width,height]=outputSize();
    const args={detail_mode:$('detail-mode').value,large_mode:$('large-mode').value,model_id:$('model-id').value,prompt:$('prompt').value,negative_prompt:$('negative').value,reference_ids:refs.map(r=>r.id),width,height,steps:Number($('steps').value),cache_mode:$('cache-mode').value,cfg_scale:Number($('cfg-scale').value)};
    if($('vae-tile-size').value!=='auto')args.vae_tile_size=Number($('vae-tile-size').value);
    if($('seed').value!=='')args.seed=Number($('seed').value);
    const job=await api('/api/jobs',args);$('filter').value='all';limit=30;message('已加入队列，可继续提交其他任务。');await refresh();cards.get(job.id)?.element.scrollIntoView({block:'nearest',behavior:'smooth'});
  }catch(e){message(e.message);}finally{submitting=false;$('submit').disabled=false;$('file').disabled=$('model-id').value==='wai-illustrious-v17';}
};
const active=j=>['queued','starting','running'].includes(j.status);
function makeCard(j){
  const element=document.createElement('article');element.className='card';element.dataset.id=j.id;
  if(location.pathname.endsWith('/'+j.id))element.classList.add('selected');
  const state=document.createElement('div');state.className='state';const title=document.createElement('h3');title.textContent=j.prompt?.slice(0,100)||'图片任务';
  const meta=document.createElement('p');meta.className='muted';const modelName=j.model_id==='viggle-qwen-image-2.1-v0.3'?'Viggle v0.3 · 6步':j.model_id==='viggle-qwen-image-2.1-v0.3-9step'?'Viggle v0.3 · 9步细节':j.model_id==='wai-illustrious-v17'?'WAI-Illustrious v17':j.model_id==='viggle-qwen-image-2.1-4step'?'Viggle Turbo 4步（v0.1）':j.model_id==='viggle-qwen-image-2.1-v0.2.1'?'Viggle Turbo 6步（v0.2.1预览）':'Qwen-Image-2.1';meta.textContent=`${modelName} · ${j.width} × ${j.height} ${j.detail_mode==='8k'?' 基础图 → 长边8K':''} · ${j.steps}步 · CFG ${j.cfg_scale??6} · 种子 ${j.seed} · ${{easycache:'EasyCache',spectrum:'Spectrum'}[j.cache_mode]||'无缓存'}`;
  const identity=document.createElement('div');identity.className='task-identity';
  const idLabel=document.createElement('label');idLabel.textContent='任务ID';idLabel.htmlFor=`task-id-${j.id}`;
  const idField=document.createElement('input');idField.id=idLabel.htmlFor;idField.value=j.id;idField.readOnly=true;idField.onclick=()=>idField.select();
  const copyId=button('复制ID',async()=>{try{await navigator.clipboard.writeText(j.id);copyId.textContent='已复制';}catch{ idField.focus();idField.select();copyId.textContent='请手动复制';}});
  identity.append(idLabel,idField,copyId);
  const time=document.createElement('div');time.className='muted';time.textContent=new Date(j.createdAt).toLocaleString();
  const bar=document.createElement('progress'), note=document.createElement('p');note.className='muted';
  const img=document.createElement('img');img.className='preview';img.alt='生成结果';img.loading='lazy';img.hidden=true;img.onclick=()=>preview(img.src);
  const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='提示词与参考图';
  const p=document.createElement('pre');p.textContent=`提示词：${j.prompt}\n\n反向提示词：${j.negative_prompt||'（未填写）'}`;details.append(summary,p);
  const ids=j.reference_ids||j.referenceImages?.map(s=>s.split('/').pop().replace('.png',''))||(j.referenceImage?[j.referenceImage.split('/').pop().replace('.png','')]:[]);
  if(ids.length){const box=document.createElement('div');box.className='refs';ids.forEach((id,i)=>{const r=document.createElement('img');r.style.cssText='width:70px;height:70px;object-fit:cover;cursor:zoom-in';r.alt=`参考图 ${i+1}`;r.loading='lazy';r.src=`/references/${id}.png`;r.onclick=()=>preview(r.src);box.append(r);});details.append(box);}
  const actions=document.createElement('div');actions.className='actions';const download=document.createElement('a');download.className='button';download.textContent='保存图片';download.href=`/images/${j.id}.png`;download.download=`${j.model_id||'qwen'}-${j.id}.png`;download.hidden=true;
  const use=button('作为参考图',async()=>{if(preparing||submitting){message('请等待当前上传或提交完成');return;}try{if(preparing||submitting)throw Error('请等待当前上传或提交完成');if(refs.length>=referenceLimit())throw Error('参考图已满，请先移除一张');preparing=true;$('submit').disabled=true;const r=await fetch(`/images/${j.id}.png`);if(!r.ok)throw Error('读取图片失败');const blob=await r.blob();const bitmap=await createImageBitmap(blob);let png,width,height;try{const scale=Math.min(1,1024/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);png=canvas.toDataURL('image/png');width=canvas.width;height=canvas.height;}finally{bitmap.close();}const upload=await api('/api/references',{data:png.split(',')[1]});if($('model-id').value==='wai-illustrious-v17'){$('model-id').value='qwen-image-2.1';$('model-id').onchange();}refs.push({id:upload.id,png,width,height});drawRefs();message('已添加为参考图，原结果删除不会影响这份参考图。');$('prompt').focus();}catch(e){message(e.message);}finally{preparing=false;$('submit').disabled=submitting;}});use.hidden=true;
  const confirm=document.createElement('div');confirm.className='inline-confirm';confirm.hidden=true;
  const explanation=document.createElement('p');explanation.textContent='删除此任务及生成结果？运行中的任务会先停止，上传的参考图保留。';
  const yes=button('确认删除',async()=>{yes.disabled=true;try{await api(`/api/jobs/${j.id}/delete`,{});confirm.hidden=true;await refresh();}catch(e){explanation.textContent=e.message;}finally{yes.disabled=false;}},'danger');
  confirm.append(explanation,yes,button('取消',()=>{confirm.hidden=true;}));
  const remove=button('删除任务',()=>{confirm.hidden=false;},'danger');const baseDownload=document.createElement('a');baseDownload.className='button';baseDownload.textContent='保存基础图';baseDownload.href=`/base-images/${j.id}.png`;baseDownload.download=`base-${j.id}.png`;baseDownload.hidden=true;actions.append(download,baseDownload,use,remove);
  element.append(state,identity,title,meta,time,bar,note,img,actions,confirm,details);
  return {element,state,bar,note,img,download,baseDownload,use,remove};
}
function render(){
  const list=allJobs.filter(j=>$('filter').value==='all'||($('filter').value==='active'?active(j):j.status===$('filter').value));
  const visible=list.slice(0,limit), ids=new Set(visible.map(j=>j.id));
  for(const [id,card] of cards)if(!ids.has(id)){card.element.remove();cards.delete(id);}
  $('tasks').querySelector('.empty')?.remove();
  for(const [index,j] of visible.entries()){
    if(!cards.has(j.id))cards.set(j.id,makeCard(j));const c=cards.get(j.id);
    c.state.textContent=j.deleting?'正在停止并删除…':j.orphaned?'管理进程中断，等待绘图退出':j.status==='queued'?`排队中 · 第 ${j.queuePosition} 个`:j.status==='completed'?'已完成':j.status==='failed'?'生成失败':j.stage||'正在准备';
    c.state.classList.toggle('failed',j.status==='failed');c.bar.hidden=!active(j)&&!j.decodeProgress&&!j.enhanceProgress;const displayedProgress=j.enhanceProgress||j.decodeProgress||j.progress;c.bar.max=displayedProgress?.total||100;c.bar.setAttribute('aria-label',j.enhanceProgress?'细节增强进度':j.decodeProgress?'图片解码进度':'图片生成进度');
    if(displayedProgress)c.bar.value=displayedProgress.step;else c.bar.removeAttribute('value');
    const elapsed=j.startedAt?Math.max(0,Math.round(((j.finishedAt?Date.parse(j.finishedAt):Date.now())-Date.parse(j.startedAt))/1000)):0;
    c.note.textContent=j.error||[j.enhanceProgress?`增强 ${j.enhanceProgress.step}/${j.enhanceProgress.total} 块`:j.decodeProgress?`解码 ${j.decodeProgress.step}/${j.decodeProgress.total} 块`:j.progress?`${j.progress.step}/${j.progress.total} 步`:'',elapsed?`用时 ${Math.floor(elapsed/60)}分${elapsed%60}秒`:'',j.status==='queued'?'轮到后自动开始':''].filter(Boolean).join(' · ');
    c.baseDownload.hidden=!j.baseImage;
    const complete=j.status==='completed';c.img.hidden=c.download.hidden=c.use.hidden=!complete;
    if(complete&&!c.img.getAttribute('src'))c.img.src=`/images/${j.id}.png`;
    c.remove.disabled=!!j.deleting;const at=$('tasks').children[index];if(at!==c.element)$('tasks').insertBefore(c.element,at||null);
  }
  if(!visible.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='这里还没有任务。在左侧填写提示词，开始创作。';$('tasks').append(empty);}
  $('counts').textContent=`共 ${allJobs.length} 个任务 · ${allJobs.filter(j=>j.status==='running'||j.status==='starting').length} 个生成中 · ${allJobs.filter(j=>j.status==='queued').length} 个排队中`;
  $('more').hidden=list.length<=limit;
}
async function refresh(){if(refreshing)return;refreshing=true;try{const r=await fetch('/api/jobs');if(!r.ok)throw Error('暂时无法连接本地图片服务');allJobs=(await r.json()).jobs;const catalog=await fetch('/api/models');if(catalog.ok){const {waiReady,detailReady,viggleReady,viggleV021Ready,viggleV03Ready}=await catalog.json();$('detail-mode').querySelector('[value="8k"]').disabled=!detailReady;const option=$('model-id').querySelector('[value="wai-illustrious-v17"]');option.disabled=!waiReady;option.textContent=waiReady?'WAI-Illustrious SDXL v17 · 插画文生图':'WAI-Illustrious SDXL v17 · 下载与校验中';const turbo=$('model-id').querySelector('[value="viggle-qwen-image-2.1-4step"]');turbo.disabled=!viggleReady;turbo.textContent=viggleReady?'Viggle Turbo Qwen · 4步版（v0.1）':'Viggle Turbo Qwen · 4步版（安装中）';for(const [id,label] of [['viggle-qwen-image-2.1-v0.3','Viggle v0.3 · 6步干净画面'],['viggle-qwen-image-2.1-v0.3-9step','Viggle v0.3 · 9步细节增强']]){const o=$('model-id').querySelector(`[value="${id}"]`);o.disabled=!viggleV03Ready;o.textContent=label+(viggleV03Ready?'':'（安装中）');}const turboV02=$('model-id').querySelector('[value="viggle-qwen-image-2.1-v0.2.1"]');turboV02.disabled=!viggleV021Ready;turboV02.textContent=viggleV021Ready?'Viggle Turbo Qwen · 6步版（v0.2.1预览）':'Viggle Turbo Qwen · 6步版（v0.2.1安装中）';}$('load-error').textContent='';render();}catch(e){$('load-error').textContent=e.message+'，将在5秒后重试。';}finally{refreshing=false;}}
$('filter').onchange=()=>{limit=30;render();};$('refresh').onclick=refresh;$('more').onclick=()=>{limit+=30;render();};

const qwenStepsNote=$('steps-note').textContent;
const standardDetailNote=$('detail-note').textContent;
const standardLargeNote=$('large-note').textContent;
$('model-id').onchange=()=>{
 const model=$('model-id').value,wai=model==='wai-illustrious-v17',viggle=model.startsWith('viggle-qwen-image-2.1-'),viggleV02=model==='viggle-qwen-image-2.1-v0.2.1',v03=model.startsWith('viggle-qwen-image-2.1-v0.3'),turboSteps=model.endsWith('v0.3-9step')?9:viggleV02||v03?6:4;
 $('model-note').textContent=wai?'WAI：插画文字生图，建议英文标签；当前不支持参考图编辑。1024方图、25步、CFG6、Euler a。模型下载未完成时无法提交。':viggleV02?'Viggle Turbo v0.2.1：官方新版LoRA预览版，按指定6步sigma调度运行，CFG=1、不支持反向提示词；最多10张参考图。每步耗时及画质尚未在本机验收。':viggle?'Viggle Turbo 4步LoRA（v0.1）：原生分辨率最高约432万像素，固定4步/CFG1；支持最多10张参考图。高像素每步会明显更慢，8K为生成后AI增强。':'Qwen 支持最多10张参考图。';
 for(const id of ['speed-preset','cache-mode','cfg-scale','vae-tile-size'])$(id).disabled=wai||viggle;
 $('large-mode').disabled=wai;
 $('file').disabled=wai;$('negative').disabled=viggle;
 if(viggle){$('negative').value='';$('detail-mode').value='standard';}
 $('render-size').disabled=false;
 for(const option of $('size').options){const [w,h]=option.value.split('x').map(Number);option.disabled=(wai&&w*h>2097152)||(viggle&&w*h>4325376);}
 $('cache-mode').value=wai||viggle?'none':'easycache';$('cfg-scale').value=viggle?'1':'6';$('vae-tile-size').value='auto';$('large-mode').value='balanced';
 $('large-mode').options[0].textContent=viggle?'自动分块 · 超过2MP时':'标准模式';
 $('large-mode').options[1].textContent=viggle?'省内存 · 始终VAE分块':'加速模式 · 权重驻留 + 解码48';
 $('large-note').textContent=viggle?'自动模式在超过2MP时分块编码/解码，仍按原分辨率生成；省内存模式始终分块VAE，峰值内存更低但可能更慢。':'1152×1536样图分项测试：48解码快约10%，权重驻留采样快约5%。估算整张约快7%；组合效果未单独实测。小图与WAI不启用。';
 $('detail-note').textContent=viggle?`8K会先按Viggle ${String(turboSteps)}步生成所选尺寸，再用本机AI超分分块增强至长边7680；耗时更长，增强可能改变纹理。`:standardDetailNote;
 $('speed-preset').value=wai?'original':'balanced';
 $('speed-note').textContent=wai?'WAI 使用独立参数，Qwen 的缓存测速不适用于此模型。':viggle?`Viggle 固定${String(turboSteps)}步；改用大图模式控制VAE内存占用。`:speedNotes.balanced;
 $('steps').value=wai?'25':viggle?(String(turboSteps)):'20';$('steps').disabled=viggle;
 $('size').value=viggleV02?'1248x2688':wai||viggle?'1024x1024':'512x512';
 $('steps-note').textContent=wai?'建议25步；快速试图可尝试15步，细节不足可用30步。耗时以本机测试为准。':viggleV02?'v0.2.1要求sigmas=[1,0.9375,0.875,0.75,0.5,0.25]，系统固定采用官方6步日程；预览版尚未本机对照。':viggle?'Viggle v0.1采用固定4步官方训练设置；当前正式模型仍可能更忠实，先用相同样张对比。':'Qwen 支持1–50步，默认20步。'+qwenStepsNote;
 if(v03){$('model-note').textContent='Viggle v0.3：画面颗粒更少，细纹理略柔；最多3张参考图，CFG1，不支持反向提示词。保留旧版供对照。';$('steps-note').textContent=turboSteps===9?'9步：前7步Turbo，最后2步关闭LoRA并刷新KV缓存，由底模补细节；比6步更慢。':'固定6步官方调度；建议先从1024×1024开始。';}
 sizeNote();
};

// Start with the installed v0.2.1 model and its iPhone wallpaper preset.
$('model-id').onchange();
await refresh();setInterval(refresh,5000);
