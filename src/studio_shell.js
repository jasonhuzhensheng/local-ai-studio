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
