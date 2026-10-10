/* Navigation and keyboard affordances only. No API calls or task state changes. */
(() => {
  function start() {
    const header = document.querySelector('header');
    if (!header || document.getElementById('studio-command')) return;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'studio-command-trigger';
    trigger.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
    trigger.setAttribute('aria-label', '本地工具入口');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'studio-command');
    const actions = header.querySelector('.header-actions') || header;
    actions.insertBefore(trigger, actions.querySelector('.studio-language'));


    // Bundled public release history: no GitHub request or user data access.
    const historyEntries = [{"date": "2026-10-10T21:11:02+00:00", "summary": "Add a share-with-friends button for the public GitHub project", "zh": "右上角新增分享给朋友，支持系统分享、复制链接及手动复制"},{"date": "2026-10-10T20:56:59+00:00", "summary": "Add a version-specific supported model and workflow directory", "zh": "新增支持模型入口，按类型列出当前版本模型与组合流程"},{"date": "2026-10-10T20:46:42+00:00", "summary": "Add offline software update history to the studio header", "zh": "右上角新增更新历史，离线查看各次提交时间和更改说明"}, {"date": "2026-10-10T14:39:41-06:00", "summary": "Make every studio logo link to the home page", "zh": "所有页面的 Logo 点击返回主页"}, {"date": "2026-10-10T14:11:08-06:00", "summary": "Place studio inputs on the left and generated content on the right", "zh": "输入和操作移到左侧，生成内容放在右侧"}, {"date": "2026-10-10T14:04:18-06:00", "summary": "Publish MYAI branding and refreshed studio previews", "zh": "发布 myai 品牌、Logo 和更新后的界面截图"}, {"date": "2026-10-10T13:29:17-06:00", "summary": "Apply Brick Cyber Studio design across workspaces", "zh": "四类页面采用积木赛博风格，改进布局与快捷操作"}, {"date": "2026-10-10T13:04:20-06:00", "summary": "Add 33-language interface and localized documentation", "zh": "新增33种界面语言及对应说明文档"}, {"date": "2026-10-10T12:42:39-06:00", "summary": "Add bilingual documentation and persistent Chinese-English interface switch", "zh": "新增中英双语说明和语言偏好保存"}, {"date": "2026-10-10T12:21:27-06:00", "summary": "Add privacy-safe interface previews to project introduction", "zh": "项目介绍加入使用虚构内容的界面预览"}, {"date": "2026-10-10T12:07:25-06:00", "summary": "Refresh release checksums after removing private address", "zh": "清除私有地址后更新发布文件校验和"}, {"date": "2026-10-05T10:39:07-06:00", "summary": "Rename website to macbook pro工作室", "zh": "更新工作室名称"}, {"date": "2026-10-04T23:06:49-06:00", "summary": "Add pinned Viggle v0.3 six-step and nine-step modes", "zh": "加入固定版本 Viggle v0.3 的6步和9步模式"}, {"date": "2026-10-04T16:13:09-06:00", "summary": "Add website login and administrator account management", "zh": "新增登录与管理员账号管理"}, {"date": "2026-10-04T15:32:07-06:00", "summary": "Import Local AI Studio migration source and setup instructions", "zh": "首次导入工作室源码和迁移安装说明"}];
    const historyLabels = {"bg": "История на актуализациите", "cs": "Historie aktualizací", "da": "Opdateringshistorik", "de": "Updateverlauf", "el": "Ιστορικό ενημερώσεων", "en": "Update history", "es": "Historial de actualizaciones", "fi": "Päivityshistoria", "fr": "Historique des mises à jour", "hi": "अपडेट इतिहास", "hr": "Povijest ažuriranja", "hu": "Frissítési előzmények", "id": "Riwayat pembaruan", "it": "Cronologia aggiornamenti", "ja": "更新履歴", "ko": "업데이트 기록", "lt": "Atnaujinimų istorija", "ms": "Sejarah kemas kini", "nb": "Oppdateringshistorikk", "nl": "Updategeschiedenis", "pl": "Historia aktualizacji", "pt-BR": "Histórico de atualizações", "pt": "Histórico de atualizações", "ro": "Istoricul actualizărilor", "ru": "История обновлений", "sk": "História aktualizácií", "sl": "Zgodovina posodobitev", "sv": "Uppdateringshistorik", "th": "ประวัติการอัปเดต", "tr": "Güncelleme geçmişi", "vi": "Lịch sử cập nhật", "zh": "更新历史", "zh-TW": "更新歷史"};
    const historyButton = document.createElement('button');
    historyButton.type = 'button';historyButton.className = 'studio-history-trigger';
    historyButton.dataset.i18nIgnore = '';historyButton.setAttribute('aria-haspopup','dialog');historyButton.setAttribute('aria-controls','studio-updates');
    actions.insertBefore(historyButton, actions.querySelector('.studio-language'));
    const historyDialog=document.createElement('dialog');historyDialog.id='studio-updates';historyDialog.setAttribute('aria-labelledby','studio-updates-title');historyDialog.dataset.i18nIgnore='';
    const historyHead=document.createElement('div');historyHead.className='studio-command-head';
    const historyTitle=document.createElement('h2');historyTitle.id='studio-updates-title';
    const historyClose=document.createElement('button');historyClose.type='button';historyClose.textContent='×';
    const historyList=document.createElement('ol');historyList.className='studio-update-list';
    historyHead.append(historyTitle,historyClose);historyDialog.append(historyHead,historyList);document.body.append(historyDialog);
    function renderHistory(){
      const lang=window.StudioI18n?.language||'en';historyTitle.textContent=historyButton.textContent=historyLabels[lang]||historyLabels.en;
      historyClose.setAttribute('aria-label',window.StudioI18n?.t('取消')||'Close');historyList.replaceChildren();
      const formatter=new Intl.DateTimeFormat(lang==='zh'?'zh-CN':lang,{dateStyle:'medium',timeStyle:'long'});
      for(const entry of historyEntries){const item=document.createElement('li'),time=document.createElement('time'),description=document.createElement('p');time.dateTime=entry.date;time.textContent=formatter.format(new Date(entry.date));description.textContent=lang==='zh'||lang==='zh-TW'?entry.zh:entry.summary;item.append(time,description);historyList.append(item);}
    }
    historyButton.addEventListener('click',()=>{if(document.querySelector('dialog[open]'))return;renderHistory();historyDialog.showModal();historyClose.focus();});
    historyClose.addEventListener('click',()=>historyDialog.close());historyDialog.addEventListener('close',()=>historyButton.focus());
    historyDialog.addEventListener('click',event=>{if(event.target!==historyDialog)return;const b=historyDialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)historyDialog.close();});
    new MutationObserver(renderHistory).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});renderHistory();


    const modelEntries=[{"id": "qwen-image-2.1", "name": "Qwen-Image-2.1 · 生图 / 多图编辑", "group": "图片生成"}, {"id": "wai-illustrious-v17", "name": "WAI-Illustrious SDXL v17 · 插画文生图", "group": "图片生成"}, {"id": "viggle-qwen-image-2.1-4step", "name": "Viggle Turbo Qwen · 4步版（v0.1）", "group": "图片生成"}, {"id": "viggle-qwen-image-2.1-v0.2.1", "name": "Viggle Turbo Qwen · 6步版（v0.2.1预览）", "group": "图片生成"}, {"id": "viggle-qwen-image-2.1-v0.3", "name": "Viggle v0.3 · 6步干净画面", "group": "图片生成"}, {"id": "viggle-qwen-image-2.1-v0.3-9step", "name": "Viggle v0.3 · 9步细节增强", "group": "图片生成"}, {"id": "qwen3.8-27b-local", "name": "Qwen3.8 27B · LM Studio", "group": "文字对话"}, {"id": "h3-fl2va", "name": "MiniMax H3 · FL2VA · 0–2 references · Experimental", "group": "视频生成"}, {"id": "h3-ref2va", "name": "MiniMax H3 · Ref2VA · 1–9 references · Experimental", "group": "视频生成"}, {"id": "realesrgan-x4plus", "name": "Real-ESRGAN x4plus · 4× upscaling component", "group": "图片生成"}];
    const modelLabels=["Поддържани модели", "Podporované modely", "Understøttede modeller", "Unterstützte Modelle", "Υποστηριζόμενα μοντέλα", "Supported models", "Modelos compatibles", "Tuetut mallit", "Modèles pris en charge", "समर्थित मॉडल", "Podržani modeli", "Támogatott modellek", "Model yang didukung", "Modelli supportati", "対応モデル", "지원 모델", "Palaikomi modeliai", "Model disokong", "Støttede modeller", "Ondersteunde modellen", "Obsługiwane modele", "Modelos compatíveis", "Modelos compatíveis", "Modele acceptate", "Поддерживаемые модели", "Podporované modely", "Podprti modeli", "Modeller som stöds", "โมเดลที่รองรับ", "Desteklenen modeller", "Mô hình được hỗ trợ", "支持模型", "支援模型"];
    const modelButton=document.createElement('button');modelButton.type='button';modelButton.className='studio-model-trigger';modelButton.dataset.i18nIgnore='';modelButton.setAttribute('aria-haspopup','dialog');modelButton.setAttribute('aria-controls','studio-models');actions.insertBefore(modelButton,actions.querySelector('.studio-language'));
    const modelDialog=document.createElement('dialog');modelDialog.id='studio-models';modelDialog.dataset.i18nIgnore='';modelDialog.setAttribute('aria-labelledby','studio-models-title');
    const modelHead=document.createElement('div');modelHead.className='studio-command-head';const modelTitle=document.createElement('h2');modelTitle.id='studio-models-title';const modelClose=document.createElement('button');modelClose.type='button';modelClose.textContent='×';modelHead.append(modelTitle,modelClose);
    const modelNote=document.createElement('p');modelNote.className='muted';const modelList=document.createElement('div');modelDialog.append(modelHead,modelNote,modelList);document.body.append(modelDialog);
    function renderModels(){const lang=window.StudioI18n?.language||'en',t=window.StudioI18n?.t||((x)=>x),chinese=lang.startsWith('zh');const index=window.StudioI18n?.locales.findIndex(x=>x.code===lang)??5;modelTitle.textContent=modelButton.textContent=modelLabels[index]||modelLabels[5];modelClose.setAttribute('aria-label',t('取消'));modelNote.textContent=chinese?'本版本支持的模型与组合流程；不代表已安装或正在运行。实验功能仍需验证，具体可用性以生成页面为准。文字模型需在 LM Studio 加载，视频和扩展模型需独立安装。':'Models and workflows in this version; listed support does not imply installed or running. Experimental features require validation. Check the generation page for availability. Load the chat model in LM Studio; video and extensions require separate installation.';modelList.replaceChildren();for(const group of ['图片生成','文字对话','视频生成']){const h=document.createElement('h3');h.textContent=t(group);const list=document.createElement('ul');list.className='studio-model-list';for(const entry of modelEntries.filter(e=>e.group===group)){const li=document.createElement('li'),name=document.createElement('div'),id=document.createElement('code');name.textContent=t(entry.name);id.textContent=entry.id;li.append(name,id);list.append(li);}modelList.append(h,list);}}
    modelButton.addEventListener('click',()=>{if(document.querySelector('dialog[open]'))return;renderModels();modelDialog.showModal();modelClose.focus();});modelClose.addEventListener('click',()=>modelDialog.close());modelDialog.addEventListener('close',()=>modelButton.focus());modelDialog.addEventListener('click',e=>{if(e.target!==modelDialog)return;const b=modelDialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)modelDialog.close();});new MutationObserver(renderModels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});renderModels();


    const shareURL='https://github.com/jasonhuzhensheng/local-ai-studio';
    const shareLabels=["Сподели с приятели", "Sdílet s přáteli", "Del med venner", "Mit Freunden teilen", "Κοινοποίηση σε φίλους", "Share with friends", "Compartir con amigos", "Jaa ystäville", "Partager avec des amis", "दोस्तों के साथ साझा करें", "Podijeli s prijateljima", "Megosztás barátokkal", "Bagikan ke teman", "Condividi con gli amici", "友達にシェア", "친구에게 공유", "Bendrinti su draugais", "Kongsi dengan rakan", "Del med venner", "Delen met vrienden", "Udostępnij znajomym", "Compartilhar com amigos", "Partilhar com amigos", "Distribuie prietenilor", "Поделиться с друзьями", "Zdieľať s priateľmi", "Deli s prijatelji", "Dela med vänner", "แชร์ให้เพื่อน", "Arkadaşlarınla paylaş", "Chia sẻ với bạn bè", "分享给朋友", "分享給朋友"];
    const shareButton=document.createElement('button');shareButton.type='button';shareButton.className='studio-share-trigger';shareButton.dataset.i18nIgnore='';actions.insertBefore(shareButton,actions.querySelector('.studio-language'));
    const shareStatus=document.createElement('span');shareStatus.className='studio-share-status';shareStatus.setAttribute('role','status');shareStatus.dataset.i18nIgnore='';actions.append(shareStatus);
    const shareDialog=document.createElement('dialog');shareDialog.id='studio-share';shareDialog.setAttribute('aria-labelledby','studio-share-title');shareDialog.dataset.i18nIgnore='';const shareTitle=document.createElement('h2');shareTitle.id='studio-share-title';const shareLink=document.createElement('a');shareLink.href=shareURL;shareLink.textContent=shareURL;shareLink.target='_blank';shareLink.rel='noopener noreferrer';const shareInput=document.createElement('input');shareInput.value=shareURL;shareInput.readOnly=true;shareInput.setAttribute('aria-label','GitHub URL');const shareClose=document.createElement('button');shareClose.type='button';shareClose.textContent='×';shareDialog.append(shareTitle,shareLink,shareInput,shareClose);document.body.append(shareDialog);
    function renderShare(){const lang=window.StudioI18n?.language||'en',i=window.StudioI18n?.locales.findIndex(x=>x.code===lang)??5;shareButton.textContent=shareTitle.textContent=shareLabels[i]||shareLabels[5];shareClose.setAttribute('aria-label',window.StudioI18n?.t('取消')||'Close');}
    shareButton.addEventListener('click',async()=>{if(document.querySelector('dialog[open]'))return;shareStatus.textContent='';shareButton.disabled=true;try{if(navigator.share){try{await navigator.share({title:'myai',url:shareURL});return;}catch(error){if(error.name==='AbortError')return;}}try{await navigator.clipboard.writeText(shareURL);shareStatus.textContent=window.StudioI18n?.language.startsWith('zh')?'链接已复制':'Link copied';}catch{renderShare();shareDialog.showModal();shareInput.focus();shareInput.select();}}finally{shareButton.disabled=false;}});
    shareClose.addEventListener('click',()=>shareDialog.close());shareDialog.addEventListener('close',()=>shareButton.focus());new MutationObserver(renderShare).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});renderShare();

    const dialog = document.createElement('dialog');
    dialog.id = 'studio-command';
    dialog.setAttribute('aria-labelledby', 'studio-command-title');
    const heading = document.createElement('div');
    heading.className = 'studio-command-head';
    const title = document.createElement('h2');
    title.id = 'studio-command-title';
    title.textContent = '本地工具入口';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '取消';
    close.addEventListener('click', () => dialog.close());
    heading.append(title, close);
    const links = document.createElement('nav');
    links.className = 'studio-command-links';
    for (const [href, text] of [['/edit', '图片生成'], ['/chat', '文字对话'], ['/video', '视频生成'], ['/account', '账号设置']]) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      if (location.pathname === href) link.setAttribute('aria-current', 'page');
      links.append(link);
    }
    dialog.append(heading, links);
    document.body.append(dialog);
    let previousFocus;
    function open() {
      if (dialog.open || document.querySelector('dialog[open]')) return;
      previousFocus = document.activeElement;
      dialog.showModal();
      links.querySelector('a').focus();
    }
    trigger.addEventListener('click', open);
    dialog.addEventListener('close', () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    document.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey || !(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() === 'k') {
        if (document.querySelector('dialog[open]') && !dialog.open) return;
        event.preventDefault();
        if (dialog.open) dialog.close(); else open();
      }
      // The ordinary submit handler still performs all validation and queue checks.
      if (event.key === 'Enter' && document.body.matches('.studio-image,.studio-video') && !document.querySelector('dialog[open]')) {
        const form = document.getElementById('form');
        const submit = document.getElementById('submit');
        if (!form?.contains(document.activeElement) || !submit || submit.disabled) return;
        event.preventDefault();
        form.requestSubmit(submit);
      }
    });
    // Open existing advanced controls when native validation needs a hidden field.
    document.addEventListener('invalid', event => {
      for (let parent = event.target.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
