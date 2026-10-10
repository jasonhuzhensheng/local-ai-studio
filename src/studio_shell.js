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
    const historyEntries = [{"date": "2026-10-10T20:46:42+00:00", "summary": "Add offline software update history to the studio header", "zh": "右上角新增更新历史，离线查看各次提交时间和更改说明"}, {"date": "2026-10-10T14:39:41-06:00", "summary": "Make every studio logo link to the home page", "zh": "所有页面的 Logo 点击返回主页"}, {"date": "2026-10-10T14:11:08-06:00", "summary": "Place studio inputs on the left and generated content on the right", "zh": "输入和操作移到左侧，生成内容放在右侧"}, {"date": "2026-10-10T14:04:18-06:00", "summary": "Publish MYAI branding and refreshed studio previews", "zh": "发布 myai 品牌、Logo 和更新后的界面截图"}, {"date": "2026-10-10T13:29:17-06:00", "summary": "Apply Brick Cyber Studio design across workspaces", "zh": "四类页面采用积木赛博风格，改进布局与快捷操作"}, {"date": "2026-10-10T13:04:20-06:00", "summary": "Add 33-language interface and localized documentation", "zh": "新增33种界面语言及对应说明文档"}, {"date": "2026-10-10T12:42:39-06:00", "summary": "Add bilingual documentation and persistent Chinese-English interface switch", "zh": "新增中英双语说明和语言偏好保存"}, {"date": "2026-10-10T12:21:27-06:00", "summary": "Add privacy-safe interface previews to project introduction", "zh": "项目介绍加入使用虚构内容的界面预览"}, {"date": "2026-10-10T12:07:25-06:00", "summary": "Refresh release checksums after removing private address", "zh": "清除私有地址后更新发布文件校验和"}, {"date": "2026-10-05T10:39:07-06:00", "summary": "Rename website to macbook pro工作室", "zh": "更新工作室名称"}, {"date": "2026-10-04T23:06:49-06:00", "summary": "Add pinned Viggle v0.3 six-step and nine-step modes", "zh": "加入固定版本 Viggle v0.3 的6步和9步模式"}, {"date": "2026-10-04T16:13:09-06:00", "summary": "Add website login and administrator account management", "zh": "新增登录与管理员账号管理"}, {"date": "2026-10-04T15:32:07-06:00", "summary": "Import Local AI Studio migration source and setup instructions", "zh": "首次导入工作室源码和迁移安装说明"}];
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
