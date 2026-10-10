// Optional browser regression: install Playwright separately; uses only isolated, synthetic routes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.STUDIO_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(process.env.STUDIO_TEST_SOURCE||fileURLToPath(new URL('../src',import.meta.url)));
const browser=await chromium.launch({headless:true,...(process.env.STUDIO_TEST_BROWSER?{executablePath:process.env.STUDIO_TEST_BROWSER}:{})});
const pages={'/edit':'image_editor.html','/chat':'local_chat.html','/video':'video_editor.html','/login':'studio_account.html','/setup':'studio_account.html','/account':'studio_account.html','/studio.js':'image_editor.js','/chat.js':'local_chat.js','/video.js':'video_editor.js','/account.js':'studio_account.js','/account.css':'studio_account.css','/i18n.js':'studio_i18n.js','/i18n.css':'studio_i18n.css','/auth-guard.js':'studio_auth_guard.js','/chat_stream.mjs':'local_chat_stream.mjs'};
try{
const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN'});const errors=[];const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='studio-test.invalid')return route.abort();let file=pages[u.pathname];if(!file&&/^\/[a-z_]+\.mjs$/.test(u.pathname))file=u.pathname.slice(1);
if(file){const p=path.join(root,file);if(fs.existsSync(p))return route.fulfill({body:fs.readFileSync(p),contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript'});}
if(u.pathname==='/api/auth/status')return route.fulfill({json:{initialized:true,canSetup:false,user:page.url().includes('/login')?null:{username:'demo_user',role:'user'}}});
if(u.pathname==='/api/auth/login')return route.fulfill({status:401,json:{error:'用户名或密码错误，或账号已停用'}});
if(u.pathname==='/api/models')return route.fulfill({json:{viggleV03Ready:true,viggleV021Ready:true}});
if(u.pathname==='/api/jobs')return route.fulfill({json:{jobs:[{id:'demo-only',status:'queued',queuePosition:1,prompt:'创建图片 新对话 管理员 — 用户原文',model_id:'viggle-qwen-image-2.1-v0.3',width:1024,height:1024,steps:6,seed:42,createdAt:'2026-01-01T00:00:00Z'}]}});
if(u.pathname==='/api/video-jobs')return route.fulfill({json:{jobs:[],models:{ref2va:{ready:false}}}});
return route.fulfill({status:404,json:{error:'Not a demo route'}});
});
for(const url of ['/edit','/chat','/video','/login']){
console.log('Checking',url);
await page.goto('https://studio-test.invalid'+url);await page.locator('[data-language-select]').waitFor();
await page.locator('[data-language-select]').selectOption('zh');
const input=page.locator(url==='/chat'?'#input':url==='/login'?'#login-form input[name=username]':'#prompt');const original=url==='/login'?'demo_user':'创建图片 新对话 — keep my original input';await input.fill(original);
await page.locator('[data-language-select]').selectOption('en');await page.waitForFunction(()=>document.documentElement.lang==='en');
assert.equal(await input.inputValue(),original);
assert.deepEqual(await page.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),a=[];while(w.nextNode()){const n=w.currentNode;if(/[\u4e00-\u9fff]/.test(n.data)&&!n.parentElement.closest('script,style,textarea,input,pre,code,.bubble,.history-title,.prompt-text,.card h3,[data-i18n-ignore]'))a.push(n.data);}return a;}),[], 'Untranslated UI: '+url);
assert.equal(await page.locator('a[href="/edit"]').first().textContent(),'Images');
if(url==='/edit'){assert.match(await page.locator('#counts').textContent(),/tasks/);assert.equal(await page.locator('.card h3').textContent(),'创建图片 新对话 管理员 — 用户原文');await page.waitForTimeout(1200);assert.match(await page.locator('.card .state').textContent(),/Queued/);}
if(url==='/chat'){
await page.evaluate(()=>{const b=document.createElement('div');b.className='bubble';b.textContent='创建图片 新对话 — assistant/user original';document.querySelector('#messages').append(b);});
await page.waitForTimeout(50);assert.equal(await page.locator('.bubble').textContent(),'创建图片 新对话 — assistant/user original');}
if(url==='/login'){await page.locator('#login-form input[name=password]').fill('synthetic-password');await page.locator('#login-submit').click();await page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('Incorrect'));}
await page.locator('[data-language-select]').selectOption('zh');await page.waitForFunction(()=>document.documentElement.lang==='zh-CN');assert.equal(await input.inputValue(),original);assert.equal(await page.locator('a[href="/edit"]').first().textContent(),'图片生成');
await page.locator('[data-language-select]').selectOption('en');await page.reload();await page.waitForFunction(()=>document.documentElement.lang==='en');
// UI translations never rewrite persisted chat messages.
}
await page.setViewportSize({width:390,height:844});await page.goto('https://studio-test.invalid/edit');await page.locator('[data-language-select]').waitFor();assert(await page.locator('[data-language-select]').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
assert.deepEqual(errors,[]);console.log('Browser i18n: four pages, round trips, saved choice, dynamic state, login errors, user content and mobile width passed.');
}finally{await browser.close();}
