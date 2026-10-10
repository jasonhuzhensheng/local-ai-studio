// Isolated browser regression. Every response and account below is synthetic.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.STUDIO_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(process.env.STUDIO_TEST_SOURCE||fileURLToPath(new URL('../src',import.meta.url)));
const screenshots=process.env.STUDIO_TEST_SCREENSHOTS;
if(screenshots)fs.mkdirSync(screenshots,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.STUDIO_TEST_BROWSER?{executablePath:process.env.STUDIO_TEST_BROWSER}:{})});
const routes={'/edit':'image_editor.html','/chat':'local_chat.html','/video':'video_editor.html','/login':'studio_account.html','/setup':'studio_account.html','/account':'studio_account.html','/studio.js':'image_editor.js','/chat.js':'local_chat.js','/video.js':'video_editor.js','/account.js':'studio_account.js','/account.css':'studio_account.css','/i18n.js':'studio_i18n.js','/i18n.css':'studio_i18n.css','/auth-guard.js':'studio_auth_guard.js','/studio-theme.css':'studio_theme.css','/studio-shell.js':'studio_shell.js'};
const artwork='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><rect width="640" height="640" fill="#10202f"/><rect x="210" y="170" width="220" height="150" rx="14" fill="#ffda62"/><rect x="232" y="219" width="176" height="38" fill="#163846"/><rect x="249" y="231" width="142" height="10" fill="#66f3df"/><rect x="200" y="350" width="240" height="160" rx="8" fill="#354f65"/><text x="28" y="48" fill="#bdd4df" font-size="18" font-family="sans-serif">FICTIONAL DEMO / NOT MODEL OUTPUT</text></svg>';
try{
 const context=await browser.newContext({viewport:{width:1360,height:1040},locale:'zh-CN'});
 const page=await context.newPage(),errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*',async route=>{
  const request=route.request(),u=new URL(request.url());if(u.hostname!=='studio-test.invalid')return route.abort();
  let file=routes[u.pathname];if(!file&&/^\/[a-z_]+\.mjs$/.test(u.pathname))file=u.pathname.slice(1);
  if(!file&&/^\/locales\/[A-Za-z-]+\.json$/.test(u.pathname))file=u.pathname.slice(1);
  if(file&&fs.existsSync(path.join(root,file)))return route.fulfill({body:fs.readFileSync(path.join(root,file)),contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/javascript'});
  if(request.method()!=='GET'){writes.push(u.pathname);return route.fulfill({status:400,json:{error:'Synthetic test does not submit real work'}});}
  if(u.pathname==='/api/auth/status'){const current=new URL(page.url()).pathname;return route.fulfill({json:{initialized:current!=='/setup',canSetup:current==='/setup',user:['/login','/setup'].includes(current)?null:{username:'demo_user',role:current==='/account'?'admin':'user'}}});}
  if(u.pathname==='/api/auth/users')return route.fulfill({json:{users:[{id:'demo-admin',username:'demo_user',role:'admin',disabled:false},{id:'demo-reader',username:'demo_reader',role:'user',disabled:false}]}});
  if(u.pathname==='/api/models')return route.fulfill({json:{viggleV03Ready:true,viggleV021Ready:true}});
  if(u.pathname==='/api/jobs')return route.fulfill({json:{jobs:[{id:'demo-only',status:'completed',prompt:'虚构积木机器人 · 原文保持',model_id:'viggle-qwen-image-2.1-v0.3',width:1024,height:1024,steps:6,seed:42,createdAt:'2026-01-01T00:00:00Z'}]}});
  if(u.pathname.startsWith('/images/'))return route.fulfill({body:artwork,contentType:'image/svg+xml'});
  if(u.pathname==='/api/video-jobs')return route.fulfill({json:{jobs:[],models:{ref2va:{ready:false}}}});
  return route.fulfill({status:404,json:{error:'Synthetic route unavailable'}});
 });
 for(const url of ['/edit','/chat','/video','/login','/setup','/account']){
  await page.setViewportSize({width:1360,height:1040});await page.goto('https://studio-test.invalid'+url);
  await page.locator('.studio-command-trigger').waitFor();await page.locator('[data-language-select]').selectOption('en');
  await page.waitForFunction(()=>StudioI18n.language==='en');
  assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(11, 16, 22)');
  const input=page.locator(url==='/chat'?'#input':url==='/login'||url==='/setup'?'#login-form input[name=username]':url==='/account'?'#password-form input[name=oldPassword]':'#prompt');
  await input.fill(url==='/account'?'synthetic-secret':'demo original content');await input.focus();
  await page.keyboard.press('Control+k');await page.locator('#studio-command').waitFor();
  assert.equal(await page.locator('#studio-command').evaluate(el=>el.open),true);
  await page.waitForFunction(()=>document.querySelector('#studio-command-title').textContent==='Studio navigation');
  assert.deepEqual(await page.locator('#studio-command nav a').evaluateAll(a=>a.map(x=>new URL(x.href).pathname)),['/edit','/chat','/video','/account']);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#studio-command').evaluate(el=>el.open),false);assert.equal(await input.evaluate(el=>document.activeElement===el),true);
  if(url==='/edit'||url==='/video'){
   await page.evaluate(()=>{window.testSubmits=0;document.getElementById('form').addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();window.testSubmits++;},true);});
   const disabled=await page.locator('#submit').isDisabled();await page.locator('#submit').evaluate(el=>el.disabled=true);await input.press('Control+Enter');assert.equal(await page.evaluate(()=>window.testSubmits),0);
   await page.locator('#submit').evaluate(el=>el.disabled=false);await input.press('Control+Enter');assert.equal(await page.evaluate(()=>window.testSubmits),1);
   await input.fill('');await input.press('Control+Enter');assert.equal(await page.evaluate(()=>window.testSubmits),1);await input.fill('虚构积木机器人 · 原文保持');await page.locator('#submit').evaluate((el,value)=>el.disabled=value,disabled);
  }
  if(url==='/video'){assert.equal(await page.locator('.studio-spec').evaluate(el=>el.open),false);await page.locator('.studio-spec summary').click();assert.equal(await page.locator('#official-spec').isVisible(),true);await page.locator('.studio-spec summary').click();assert.equal(await page.locator('[data-resolution=hd]').isDisabled(),true);}
  if(url==='/account'){
   await page.locator('#users .user').first().getByRole('button',{name:'Reset password',exact:true}).click();assert.equal(await page.locator('#reset-dialog').evaluate(el=>el.open),true);await page.keyboard.press('Control+k');assert.equal(await page.locator('#studio-command').evaluate(el=>el.open),false);await page.locator('#reset-cancel').click();
  }
  await page.locator('[data-language-select]').selectOption('zh');await page.waitForFunction(()=>StudioI18n.language==='zh');
  await input.blur();if(screenshots)await page.screenshot({path:path.join(screenshots,url.slice(1)+'.png')});
  for(const width of [390,320]){await page.setViewportSize({width,height:844});for(const language of ['de','ja','zh-TW']){await page.locator('[data-language-select]').selectOption(language);await page.waitForFunction(value=>StudioI18n.language===value,language);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' '+width+' '+language);}}
  if(screenshots)await page.screenshot({path:path.join(screenshots,url.slice(1)+'-mobile.png')});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
 console.log('PASS: six page states; command dialog/focus/translation; safe native submission and validation; disabled video and account dialogs; mobile 390/320; no network writes.');
}finally{await browser.close();}
