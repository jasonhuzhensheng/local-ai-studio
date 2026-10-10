import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/studio_i18n.js',import.meta.url),'utf8');
function load(saved='en',blocked=false){const window={addEventListener(){}};const context={window,navigator:{language:'zh-CN'},localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;}},document:{readyState:'loading',addEventListener(){}},Object,Map,WeakMap,RegExp};vm.runInNewContext(source,context);return window.StudioI18n;}
const en=load();assert.equal(en.t('创建图片'),'Create an image');assert.equal(en.t('共 3 个任务 · 1 个生成中 · 2 个排队中'),'3 tasks · 1 generating · 2 queued');assert.equal(en.t('排队中 · 第 2 个'),'Queued · Position 2');assert.equal(en.t('重置 demo_user 的密码'),'Reset password for demo_user');assert.equal(en.t('确定永久删除账号 demo_user？共享生成任务会保留。'),'Permanently delete account demo_user? Shared generation tasks will be kept.');assert.equal(en.t('密码需要12至128个字符'),'Passwords must be 12–128 characters');assert.equal(en.t('自定义用户内容 abc'),'自定义用户内容 abc');assert.equal(load('zh').t('创建图片'),'创建图片');assert.equal(load(null,true).language,'zh');
console.log('UI translations: labels, progress, account confirmations, errors, Chinese and unavailable storage passed.');
