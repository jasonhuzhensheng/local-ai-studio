import fs from 'node:fs';
import path from 'node:path';
import {randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCallback);
const cookieName='studio_session', ttl=12*60*60*1000;
const loopback=ip=>['127.0.0.1','::1','::ffff:127.0.0.1'].includes(ip);
const publicUser=u=>({id:u.id,username:u.username,role:u.role,disabled:u.disabled,createdAt:u.createdAt});
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
const digest=s=>createHash('sha256').update(s).digest('hex');
export function createAuth({directory,assetRoot}) {
  fs.mkdirSync(directory,{recursive:true,mode:0o700});fs.chmodSync(directory,0o700);
  const file=path.join(directory,'users.json');
  let db={version:1,users:[]};
  if(fs.existsSync(file)) {
    db=JSON.parse(fs.readFileSync(file,'utf8'));
    if(db.version!==1||!Array.isArray(db.users)||!db.users.length||!db.users.some(u=>u.role==='admin'&&!u.disabled)||db.users.some(u=>!u.id||!u.username||!['admin','user'].includes(u.role)||typeof u.disabled!=='boolean'||!/^[a-f0-9]{32}$/.test(u.salt)||!/^[a-f0-9]{64}$/.test(u.hash)))throw Error('账号文件损坏；为保护数据，服务拒绝启动');
    fs.chmodSync(file,0o600);
  }
  const sessions=new Map(),limits=new Map();let pending=Promise.resolve(),kdfs=0;
  const serialized=fn=>{const result=pending.then(fn);pending=result.catch(()=>{});return result;};
  function save(users){const tmp=file+'.'+randomUUID()+'.tmp';try{fs.writeFileSync(tmp,JSON.stringify({version:1,users}),{mode:0o600,flag:'wx'});fs.renameSync(tmp,file);db={version:1,users};}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}}
  function validatePassword(p){if(typeof p!=='string'||p.length<12||p.length>128)throw fail('密码需要12至128个字符');}
  function validateName(n){if(typeof n!=='string'||! /^[a-zA-Z0-9_-]{3,32}$/.test(n))throw fail('用户名使用3至32位字母、数字、下划线或短横线');return n.toLowerCase();}
  async function hash(p,salt){if(kdfs>=4)throw fail('登录请求较多，请稍后再试',429);kdfs++;try{return (await scrypt(p,salt,32,{N:32768,r:8,p:1,maxmem:64*1024*1024})).toString('hex');}finally{kdfs--;}}
  async function passwordMatches(p,u){if(typeof p!=='string'||p.length>128)return false;const computed=await hash(p,u?.salt||'00000000000000000000000000000000');return timingSafeEqual(Buffer.from(computed,'hex'),Buffer.from(u?.hash||'0'.repeat(64),'hex'))&&!!u;}
  function limit(req){const now=Date.now();for(const [k,v] of limits)if(v.until<now)limits.delete(k);const key=req.socket.remoteAddress;const value=limits.get(key)||{count:0,until:now+15*60000};if(value.count>=15||limits.size>=2048&&!limits.has(key))throw fail('尝试次数过多，请15分钟后再试',429);value.count++;limits.set(key,value);}
  function revoke(id){for(const [key,s]of sessions)if(s.userId===id)sessions.delete(key);}
  function current(req){const raw=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';if(!/^[a-f0-9]{64}$/.test(raw))return null;const key=digest(raw),s=sessions.get(key);if(!s)return null;if(s.expires<Date.now()){sessions.delete(key);return null;}const u=db.users.find(u=>u.id===s.userId&&!u.disabled);return u?{user:u,key}:null;}
  function cookie(req,res,token,age){res.setHeader('Set-Cookie',`${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${req.socket.encrypted?'; Secure':''}`);}
  function login(req,res,u){for(const[k,s]of sessions)if(s.expires<Date.now())sessions.delete(k);if(sessions.size>=1024)sessions.delete(sessions.keys().next().value);const token=randomBytes(32).toString('hex');sessions.set(digest(token),{userId:u.id,expires:Date.now()+ttl});cookie(req,res,token,ttl/1000);}
  const json=(res,data,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
  async function body(req){let size=0,chunks=[];for await(const c of req){size+=c.length;if(size>16384)throw fail('请求过大',413);chunks.push(c);}try{const b=JSON.parse(Buffer.concat(chunks));if(!b||typeof b!=='object'||Array.isArray(b))throw Error();return b;}catch{throw fail('请求格式错误');}}
  return async function authorize(req,res,url){
    res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
    const route=url.pathname;
    try{
      if(['/login','/setup','/account'].includes(route)&&req.method==='GET') {
        res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; form-action 'self'");
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync(path.join(assetRoot,'studio_account.html')));return true;
      }
      const locale=url.pathname.match(/^\/locales\/([A-Za-z-]+)\.json$/);
      if(locale&&["bg", "cs", "da", "de", "el", "es", "fi", "fr", "hi", "hr", "hu", "id", "it", "ja", "ko", "lt", "ms", "nb", "nl", "pl", "pt-BR", "pt", "ro", "ru", "sk", "sl", "sv", "th", "tr", "vi", "zh-TW"].includes(locale[1])&&req.method==='GET'){const file=path.join(assetRoot,'locales',locale[1]+'.json');if(!fs.existsSync(file)){res.writeHead(404,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({error:'Language catalog unavailable'}));return true;}res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(fs.readFileSync(file));return true;}
      if(['/i18n.js','/i18n.css'].includes(route)&&req.method==='GET'){res.writeHead(200,{'Content-Type':route.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8'});res.end(fs.readFileSync(path.join(assetRoot,route.endsWith('.js')?'studio_i18n.js':'studio_i18n.css')));return true;}
      if(['/account.js','/account.css'].includes(route)&&req.method==='GET'){res.writeHead(200,{'Content-Type':route.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8'});res.end(fs.readFileSync(path.join(assetRoot,route.endsWith('.js')?'studio_account.js':'studio_account.css')));return true;}
      if(route==='/api/auth/status'&&req.method==='GET'){const c=current(req);json(res,{initialized:db.users.length>0,canSetup:!db.users.length&&loopback(req.socket.remoteAddress)&&['127.0.0.1','localhost','[::1]'].includes(url.hostname),user:c?publicUser(c.user):null});return true;}
      if(route.startsWith('/api/auth/')) {
        if(req.method!=='GET'&&req.method!=='POST')throw fail('不支持此方法',405);
        if(req.method==='POST'&&(req.headers.origin!==url.origin||req.headers['content-type']?.split(';')[0]!=='application/json'))throw fail('请从本站页面提交',403);
        if(route==='/api/auth/setup'&&req.method==='POST') {
          if(!loopback(req.socket.remoteAddress)||!['127.0.0.1','localhost','[::1]'].includes(url.hostname))throw fail('请在这台Mac打开本机地址创建管理员',403);
          limit(req);const b=await body(req);
          await serialized(async()=>{if(db.users.length)throw fail('管理员已创建',409);const username=validateName(b.username);validatePassword(b.password);const salt=randomBytes(16).toString('hex');const u={id:randomUUID(),username,role:'admin',disabled:false,createdAt:new Date().toISOString(),salt,hash:await hash(b.password,salt)};save([u]);login(req,res,u);json(res,{user:publicUser(u)},201);});return true;
        }
        if(route==='/api/auth/login'&&req.method==='POST') {
          limit(req);const b=await body(req);const u=db.users.find(u=>u.username===String(b.username).toLowerCase());const expectedHash=u?.hash;
          if(!await passwordMatches(b.password,u)||u.disabled||db.users.find(x=>x.id===u.id)?.hash!==expectedHash||!db.users.includes(u))throw fail('用户名或密码错误，或账号已停用',401);
          login(req,res,u);json(res,{user:publicUser(u)});return true;
        }
        const c=current(req);if(!c)throw fail('请先登录',401);
        if(route==='/api/auth/logout'&&req.method==='POST'){sessions.delete(c.key);cookie(req,res,'',0);json(res,{ok:true});return true;}
        if(route==='/api/auth/users'&&req.method==='GET'){if(c.user.role!=='admin')throw fail('需要管理员权限',403);json(res,{users:db.users.map(publicUser)});return true;}
        if(req.method!=='POST')throw fail('找不到接口',404);
        const b=await body(req);
        await serialized(async()=>{
          const live=current(req);if(!live)throw fail('登录已失效，请重新登录',401);
          if(route==='/api/auth/password'){
            limit(req);if(!await passwordMatches(b.oldPassword,live.user))throw fail('当前密码错误',400);validatePassword(b.password);const salt=randomBytes(16).toString('hex');const updated={...live.user,salt,hash:await hash(b.password,salt)};save(db.users.map(u=>u.id===updated.id?updated:u));revoke(updated.id);cookie(req,res,'',0);json(res,{ok:true});return;
          }
          if(live.user.role!=='admin')throw fail('需要管理员权限',403);
          if(route==='/api/auth/users/create'){
            if(db.users.length>=100)throw fail('账号数量达到上限');const username=validateName(b.username);if(db.users.some(u=>u.username===username))throw fail('用户名已存在',409);validatePassword(b.password);if(!['admin','user'].includes(b.role))throw fail('角色无效');const salt=randomBytes(16).toString('hex');const u={id:randomUUID(),username,role:b.role,disabled:false,createdAt:new Date().toISOString(),salt,hash:await hash(b.password,salt)};save([...db.users,u]);json(res,{user:publicUser(u)},201);return;
          }
          const target=db.users.find(u=>u.id===b.id);if(!target)throw fail('账号不存在',404);
          let users;
          if(route==='/api/auth/users/password'){validatePassword(b.password);const salt=randomBytes(16).toString('hex');const hashValue=await hash(b.password,salt);users=db.users.map(u=>u.id===target.id?{...u,salt,hash:hashValue}:u);}
          else if(route==='/api/auth/users/delete')users=db.users.filter(u=>u.id!==target.id);
          else if(route==='/api/auth/users/update'){if(typeof b.disabled!=='boolean'||!['admin','user'].includes(b.role))throw fail('账号设置无效');users=db.users.map(u=>u.id===target.id?{...u,disabled:b.disabled,role:b.role}:u);}
          else throw fail('找不到接口',404);
          if(!users.some(u=>u.role==='admin'&&!u.disabled))throw fail('必须保留至少一个启用的管理员',409);
          save(users);revoke(target.id);json(res,{ok:true});
        });return true;
      }
      const c=current(req);
      if(!c){if(req.method==='GET'&&!/^\/(api|images|references|base-images|videos)\//.test(route)){res.writeHead(303,{Location:db.users.length?'/login':'/setup'});res.end();}else json(res,{error:db.users.length?'登录已过期，请重新登录':'请先在本机创建管理员'},401);return true;}
      req.studioUser=publicUser(c.user);return false;
    }catch(e){json(res,{error:e.status?e.message:'账号操作失败，请检查服务状态'},e.status||500);return true;}
  };
}
