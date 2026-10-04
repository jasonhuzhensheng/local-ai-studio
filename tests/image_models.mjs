import assert from 'node:assert/strict';
import {imageArgs} from '../src/image_worker.mjs';
import {submitImage} from '../src/image_submit.mjs';
const job={model_id:'wai-illustrious-v17',prompt:'a ceramic mug; literal',negative_prompt:'blur',width:1024,height:1024,steps:25,seed:42,cfg_scale:6,cache_mode:'none'};
const a=imageArgs(job,'/tmp/wai test.png');
assert.ok(a[a.indexOf('-m')+1].endsWith('waiIllustriousSDXL_v170.safetensors'));
assert.equal(a[a.indexOf('-p')+1],job.prompt);
assert.equal(a[a.indexOf('--sampling-method')+1],'euler_a');
assert.equal(a[a.indexOf('--scheduler')+1],'discrete');
assert.ok(!a.includes('--llm'));assert.ok(!a.includes('--diffusion-model'));assert.ok(!a.includes('--cache-mode'));
assert.throws(()=>imageArgs({...job,referenceImages:['/tmp/a.png']},'/tmp/a.png'));
assert.throws(()=>submitImage({...job,reference_ids:['00000000-0000-0000-0000-000000000000']}),/WAI/);
assert.throws(()=>submitImage({...job,cache_mode:'easycache'}),/无缓存/);
assert.throws(()=>submitImage({...job,width:2048,height:2048}),/200万/);
assert.throws(()=>submitImage({...job,model_id:'../../bad'}),/不支持/);
const old=imageArgs({...job,model_id:undefined},'/tmp/qwen.png');assert.ok(old.includes('--llm'));
console.log('PASS: model routing, legacy Qwen, WAI parameters and capability validation');

const q={prompt:'test',width:384,height:512,steps:20,seed:42};
assert.ok(imageArgs(q,'/tmp/a').includes('--offload-to-cpu'));
assert.ok(!imageArgs({...q,qwen_optimization:'resident'},'/tmp/a').includes('--offload-to-cpu'));
assert.ok(imageArgs({...q,qwen_optimization:'vae_direct'},'/tmp/a').includes('--vae-conv-direct'));
assert.throws(()=>submitImage({...q,qwen_optimization:'invalid'}),/不支持/);
assert.throws(()=>submitImage({...q,model_id:'wai-illustrious-v17',qwen_optimization:'resident'}),/只适用/);

for(const threshold of [0.2,0.3,0.4]){
 const args=imageArgs({...q,cache_mode:'easycache',cache_threshold:threshold},'/tmp/a');
 assert.equal(args[args.indexOf('--cache-option')+1],`threshold=${threshold}`);
}
assert.throws(()=>submitImage({...q,cache_mode:'none',cache_threshold:0.3}),/缓存强度/);
assert.throws(()=>submitImage({...q,cache_mode:'easycache',cache_threshold:0.5}),/缓存强度/);
assert.throws(()=>imageArgs({...q,cache_mode:'easycache',cache_threshold:0.5},'/tmp/a'),/缓存强度/);
console.log('PASS: EasyCache threshold whitelist and CLI forwarding');
