import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {once} from 'node:events';import http from 'node:http';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'studio-auth-'));
process.env.LOCAL_IMAGE_DATA_DIR=tmp;
const {createGallery}=await import('../src/image_gallery.mjs');
const {createAuth}=await import('../src/studio_auth.mjs');
const port=18247,base=`http://127.0.0.1:${port}`;let server;
const start=async()=>{server=createGallery({port,schedule:false});server.listen(port,'127.0.0.1');await once(server,'listening');};
const stop=async()=>{server.closeAllConnections();await new Promise(r=>server.close(r));};
const call=(route,body,cookie='',origin=base)=>fetch(base+route,{redirect:'manual',headers:{Connection:"close",Cookie:cookie,...(body===undefined?{}:{Origin:origin,'Content-Type':'application/json'})},...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)})});
const getCookie=r=>r.headers.get('set-cookie').split(';')[0];
const pw='Test-account-password-123';let admin,member;
try{
 await start();
 for(const route of ['/i18n.js','/i18n.css','/studio-theme.css','/studio-shell.js']){const asset=await call(route);assert.equal(asset.status,200,route);assert.match(asset.headers.get('content-type'),route.endsWith('.js')?/javascript/:/css/);assert.ok((await asset.text()).length>0);}

 for(const route of ['/api/jobs','/api/models','/api/video-jobs','/api/chat-tasks/123','/images/00000000-0000-0000-0000-000000000000.png','/references/00000000-0000-0000-0000-000000000000.png','/base-images/00000000-0000-0000-0000-000000000000.png','/videos/00000000-0000-0000-0000-000000000000.mp4'])assert.equal((await call(route)).status,401,route);
 for(const route of ['/locales/es.json','/locales/de.json']){const response=await call(route);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/application\/json/);const catalog=await response.json();assert.ok(Object.keys(catalog).length>500);}
 for(const route of ['/locales/unknown.json','/locales/%2e%2e/studio_auth.mjs'])assert.notEqual((await call(route)).status,200);
 assert.equal((await call('/edit')).headers.get('location'),'/setup');
 assert.equal((await call('/api/auth/setup',{username:'admin',password:pw},'','http://evil.test')).status,403);
 assert.equal((await call('/api/auth/setup',{username:'admin',password:'short'})).status,400);
 const setup=await call('/api/auth/setup',{username:'admin',password:pw});assert.equal(setup.status,201);admin=getCookie(setup);assert.match(setup.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);
 assert.equal((await call('/api/auth/setup',{username:'other',password:pw})).status,409);
 const disk=fs.readFileSync(path.join(tmp,'auth/users.json'),'utf8');assert.ok(!disk.includes(pw));assert.equal(fs.statSync(path.join(tmp,'auth/users.json')).mode&0o777,0o600);
 assert.equal((await call('/api/auth/login',{username:'admin',password:'wrong'})).status,401);
 assert.equal((await call('/api/jobs',undefined,admin)).status,200);
 assert.equal((await call('/api/auth/users/create',{username:'member',password:pw,role:'user'},admin)).status,201);
 assert.equal((await call('/api/auth/users/create',{username:'MEMBER',password:pw,role:'user'},admin)).status,409);
 member=getCookie(await call('/api/auth/login',{username:'member',password:pw}));
 assert.equal((await call('/api/auth/users',undefined,member)).status,403);
 assert.equal((await call('/api/auth/users/create',{username:'badadmin',password:pw,role:'admin'},member)).status,403);
 assert.equal((await call('/api/auth/logout',{},admin,'https://evil.test')).status,403);
 const users=(await(await call('/api/auth/users',undefined,admin)).json()).users;const a=users.find(u=>u.username==='admin'),m=users.find(u=>u.username==='member');assert.ok(users.every(u=>!u.hash&&!u.salt));
 assert.equal((await call('/api/auth/users/delete',{id:a.id},admin)).status,409);
 assert.equal((await call('/api/auth/users/update',{id:a.id,role:'user',disabled:false},admin)).status,409);
 assert.equal((await call('/api/auth/users/update',{id:m.id,role:'user',disabled:true},admin)).status,200);
 assert.equal((await call('/api/jobs',undefined,member)).status,401);
 assert.equal((await call('/api/auth/login',{username:'member',password:pw})).status,401);
 await call('/api/auth/users/update',{id:m.id,role:'user',disabled:false},admin);
 member=getCookie(await call('/api/auth/login',{username:'member',password:pw}));
 await call('/api/auth/users/password',{id:m.id,password:pw+'new'},admin);
 assert.equal((await call('/api/jobs',undefined,member)).status,401);
 member=getCookie(await call('/api/auth/login',{username:'member',password:pw+'new'}));
 assert.equal((await call('/api/auth/password',{oldPassword:'bad',password:pw},member)).status,400);
 assert.equal((await call('/api/auth/password',{oldPassword:pw+'new',password:pw+'changed'},member)).status,200);
 assert.equal((await call('/api/jobs',undefined,member)).status,401);
 await stop();await start(); // Accounts persist; sessions intentionally do not.
 assert.equal((await call('/api/jobs',undefined,admin)).status,401);
 admin=getCookie(await call('/api/auth/login',{username:'admin',password:pw}));
 await call('/api/auth/users/delete',{id:m.id},admin);
 assert.equal((await call('/api/auth/login',{username:'member',password:pw+'changed'})).status,401);
 await call('/api/auth/logout',{},admin);assert.equal((await call('/api/jobs',undefined,admin)).status,401);
 for(let i=0;i<16;i++)await call('/api/auth/login',{username:'absent',password:'bad'});
 assert.equal((await call('/api/auth/login',{username:'absent',password:'bad'})).status,429);
 // Verify remote setup denial without trusting X-Forwarded-For or Host.
 const auth=createAuth({directory:path.join(tmp,'remote'),assetRoot:path.resolve('src')});let status;
 const response={setHeader(){},writeHead(n){status=n;},end(){}};
 await auth({method:'POST',socket:{remoteAddress:'100.100.1.2'},headers:{origin:base,'content-type':'application/json','x-forwarded-for':'127.0.0.1'}},response,new URL(base+'/api/auth/setup'));assert.equal(status,403);
 await stop();server=null;
 // Corrupt account storage must fail closed, never reset to setup mode.
 fs.writeFileSync(path.join(tmp,'auth/users.json'),'{}');assert.throws(()=>createGallery({port,schedule:false}),/账号文件损坏/);
 console.log('PASS: authentication wall, setup origin/local restriction, hash storage, persistence, roles, last admin, revocation, CSRF, rate limit, fail-closed');
}finally{if(server)await stop();fs.rmSync(tmp,{recursive:true,force:true});}
