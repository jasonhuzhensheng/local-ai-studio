// Expired sessions return to sign-in; background generation remains on the server.
const originalFetch=window.fetch.bind(window);
window.fetch=async(...args)=>{const response=await originalFetch(...args);if(response.status===401&&new URL(response.url,location.href).origin===location.origin)location.replace('/login');return response;};
window.addEventListener('pageshow',()=>originalFetch('/api/auth/status',{cache:'no-store'}).then(r=>r.json()).then(s=>{if(!s.user)location.replace('/login');}).catch(()=>{}));
