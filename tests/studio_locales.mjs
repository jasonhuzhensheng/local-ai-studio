import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/studio_i18n.js',import.meta.url),'utf8');
function load({saved='en',fetcher=async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(new URL('../src'+url,import.meta.url),'utf8'))})}={}){
 const stored=new Map([['studio-ui-language',saved]]);const window={addEventListener(){}};
 vm.runInNewContext(source,{window,navigator:{language:'en-US'},localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)},document:{readyState:'loading',addEventListener(){}},fetch:fetcher});return {api:window.StudioI18n,stored};
}
const {api,stored}=load();assert.equal(api.locales.length,33);assert.equal(new Set(api.locales.map(x=>x.code)).size,33);
for(const [input,expected] of [['zh-Hant-HK','zh-TW'],['zh-CN','zh'],['zh-SG','zh'],['pt-BR','pt-BR'],['pt-PT','pt'],['no','nb'],['es-MX','es'],['xx','en']])assert.equal(api.supported(input),expected);
for(const locale of api.locales){assert.equal(await api.setLanguage(locale.code),true);assert.equal(api.language,locale.code);assert.equal(stored.get('studio-ui-language'),locale.code);assert.ok(api.t('创建图片').length);assert.ok(!/\{\d+\}/.test(api.t('共 3 个任务 · 1 个生成中 · 2 个排队中')));}
assert.equal(await api.setLanguage('zh'),true);assert.equal(api.t('创建图片'),'创建图片');
const failed=load({fetcher:async()=>({ok:false})});assert.equal(await failed.api.setLanguage('ja'),false);assert.equal(failed.api.language,'en');assert.equal(failed.stored.get('studio-ui-language'),'en');
const invalid=load({fetcher:async()=>({ok:true,json:async()=>({'创建图片':'x'})})});assert.equal(await invalid.api.setLanguage('de'),false);assert.equal(invalid.api.language,'en');
let resolve;const race=load({fetcher:()=>new Promise(r=>{resolve=r;})});const slow=race.api.setLanguage('ja');await race.api.setLanguage('zh');resolve({ok:true,json:async()=>JSON.parse(fs.readFileSync(new URL('../src/locales/ja.json',import.meta.url),'utf8'))});assert.equal(await slow,false);assert.equal(race.api.language,'zh');
console.log('33 catalogs validated; locale negotiation, placeholders, persistence, missing/malformed catalogs and rapid-switch race passed.');
