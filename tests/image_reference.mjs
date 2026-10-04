import assert from 'node:assert/strict';
import {saveReference,submitImage} from '../src/image_submit.mjs';
import {imageArgs,describeGenerationFailure,generationFailureMessage,childEnvironment} from '../src/image_worker.mjs';
import {parseGenerationLog} from '../src/image_jobs.mjs';
assert.match(parseGenerationLog('[viggle] DEPENDENCIES_START').stage,/加载Python依赖/);
assert.doesNotMatch(parseGenerationLog('[viggle] DEPENDENCIES_START\n[viggle] DEPENDENCIES_READY').stage,/加载Python依赖/);
assert.equal(parseGenerationLog('1/1 - 41.27s/it\ngenerating image: 1/1').progress,undefined);
const decoded=parseGenerationLog('generating image: 1/1\n20/20 - 10.0s/it\nsampling completed\ndecoding 1 latents\n3/24 - 2.0s/it');
assert.equal(decoded.progress.step,20);assert.equal(decoded.progress.total,20);assert.match(decoded.stage,/解码/);
assert.deepEqual(decoded.decodeProgress,{step:3,total:24,secondsPerTile:2});
const finished=parseGenerationLog('generating image: 1/1\n1/1 - 10.0s/it\nsampling completed\ndecoding 1 latents\n27/27 - 44.47s/it\ndecode_first_stage completed, taking 1216.06s\nsave result image success');
assert.equal(finished.decodeProgress.step,27);assert.equal(finished.decodeProgress.total,27);
assert.match(describeGenerationFailure(1,'ggml_metal_synchronize: command buffer failed\nLLM prompt encoding failed'),/Metal GPU在参考图或提示词编码/);
assert.match(describeGenerationFailure(1,'failed to allocate buffer'),/内存分配失败/);
assert.match(describeGenerationFailure(3,''),/退出（3）/);
assert.match(describeGenerationFailure(1,'RuntimeError: LOCAL_MODEL_NOT_RESIDENT: model.safetensors'),/占位记录/);
assert.match(generationFailureMessage(Error('绘图进程退出（1）'),'RuntimeError: LOCAL_MODEL_NOT_RESIDENT: tokenizer.json'),/占位记录/);
assert.equal(generationFailureMessage(Error('任务已停止'),''),'任务已停止');
if(process.platform==='darwin'){
  assert.ok(childEnvironment({model_id:'viggle-qwen-image-2.1-v0.2.1'},{}).PYTHONPYCACHEPREFIX.endsWith('/Library/Application Support/LocalImageStudio/python-cache'));
  assert.equal(childEnvironment({model_id:'viggle-qwen-image-2.1-v0.2.1'},{PYTHONPYCACHEPREFIX:'/custom/cache'}).PYTHONPYCACHEPREFIX,'/custom/cache');
  assert.equal(childEnvironment({model_id:'qwen-image-2.1'},{}).PYTHONPYCACHEPREFIX,undefined);
}
assert.match(describeGenerationFailure(1,'Fatal Python error: init_import_site\nOSError: [Errno 11] Resource deadlock avoided'),/任务尚未开始推理/);
assert.throws(()=>saveReference(Buffer.from('not an image').toString('base64')));
assert.throws(()=>submitImage({prompt:'test',reference_id:'../../private'}));
assert.throws(()=>submitImage({prompt:'test',reference_id:'00000000-0000-0000-0000-000000000000'}));
const a=imageArgs({prompt:'change background',width:512,height:512,steps:20,seed:42,referenceImage:'/tmp/reference with spaces.png'},'/tmp/result.png');
assert.equal(a[a.indexOf('-r')+1],'/tmp/reference with spaces.png');
assert.ok(a.includes('--llm_vision'));
const large=imageArgs({prompt:'blue mug',width:1248,height:2688,steps:20,seed:42,referenceImages:['/tmp/reference.png']},'/tmp/result.png');
assert.equal(large[large.indexOf('--ref-image-args')+1],'vae_input_max_pixels=1048576');
assert.equal(large[large.indexOf('-W')+1],'1248');
assert.equal(large[large.indexOf('-H')+1],'2688');
assert.ok(large.includes('--diffusion-fa'));
assert.ok(large.includes('--vae-tiling'));
assert.ok(!a.includes('--diffusion-fa'));
assert.ok(!a.includes('--vae-tiling'));
assert.ok(!imageArgs({prompt:'blue mug',width:2048,height:2048,steps:20,seed:42},'/tmp/result.png').includes('--ref-image-args'));
assert.ok(!a.includes('--cache-mode'));
assert.throws(()=>submitImage({prompt:'test',cache_mode:'unknown'}));
for(const cache_mode of ['easycache','spectrum']){
 const cached=imageArgs({prompt:'literal; prompt',negative_prompt:'blur',width:512,height:512,steps:20,seed:42,cache_mode,referenceImages:['/tmp/a.png','/tmp/b.png']},'/tmp/result.png');
 assert.equal(cached[cached.indexOf('--cache-mode')+1],cache_mode);
 assert.equal(cached.filter(x=>x==='-r').length,2);
 assert.equal(cached[cached.indexOf('-n')+1],'blur');
 assert.equal(cached[cached.indexOf('--steps')+1],'20');
}
for(const origin of ['https://example.com','null']){
 const r=await fetch('http://127.0.0.1:1235/api/edit',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,403);
}
console.log('PASS: invalid images/IDs rejected, reference passed as literal argument, cross-origin mutations rejected.');

for(const cfg_scale of [0,2,NaN,'1']) assert.throws(()=>submitImage({prompt:'test',cfg_scale}));
const fast=imageArgs({prompt:'blue background',negative_prompt:'blur',width:384,height:512,steps:20,seed:42,cfg_scale:1},'/tmp/out.png');
assert.equal(fast[fast.indexOf('--cfg-scale')+1],'1');
assert.ok(!fast.includes('-n'));
assert.equal(a[a.indexOf('--cfg-scale')+1],'6');

for(const vae_tile_size of [0,96,"48"]) assert.throws(()=>submitImage({prompt:"test",vae_tile_size}));
const tiled=imageArgs({prompt:"test",width:768,height:1536,steps:20,seed:42,vae_tile_size:48},"/tmp/test.png");
assert.equal(tiled[tiled.indexOf("--vae-tile-size")+1],"48x48");

const legacyLarge=imageArgs({prompt:"test",width:768,height:1536,steps:20,seed:42},"/tmp/test.png");
assert.ok(!legacyLarge.includes("--vae-tile-size"));

const boundedRef=imageArgs({prompt:"test",width:1152,height:1536,steps:20,seed:42,reference_max_pixels:786432,referenceImages:["/tmp/ref.png"]},"/tmp/out.png");
assert.equal(boundedRef[boundedRef.indexOf("--ref-image-args")+1],"vae_input_max_pixels=786432");
assert.throws(()=>submitImage({prompt:"test",reference_max_pixels:1}));

const tile64Args=imageArgs({prompt:"test",width:1152,height:1536,steps:20,seed:42,vae_tile_size:64},"/tmp/out.png");
assert.equal(tile64Args[tile64Args.indexOf("--vae-tile-size")+1],"64x64");
