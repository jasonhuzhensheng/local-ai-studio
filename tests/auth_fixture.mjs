import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
export const authDirectory=fs.mkdtempSync(path.join(os.tmpdir(),'auth-fixture-'));
process.on('exit',()=>fs.rmSync(authDirectory,{recursive:true,force:true}));
let cookie;
export const sessionCookie=()=>cookie;
export async function authenticatedFetch(url,options={}){
 if(!cookie){const base=new URL(url).origin;const r=await globalThis.fetch(base+'/api/auth/setup',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({username:'testadmin',password:'Isolated-test-password-123'})});if(r.status!==201)throw Error('Test setup failed: '+r.status);cookie=r.headers.get('set-cookie').split(';')[0];}
 return globalThis.fetch(url,{...options,headers:{...options.headers,Cookie:cookie}});
}
