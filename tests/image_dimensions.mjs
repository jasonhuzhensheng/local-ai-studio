import assert from 'node:assert/strict';
import {fitAspectSize,outputDimensions,MAX_IMAGE_PIXELS,PREVIEW_PIXELS} from '../src/image_dimensions.mjs';

const matched=outputDimensions({baseWidth:1248,baseHeight:2688,composition:'reference',referenceWidth:819,referenceHeight:1024});
assert.ok(Math.abs((matched[0]/matched[1])/(819/1024)-1)<=0.01);
assert.ok(matched[0]*matched[1]<=1248*2688);
assert.ok(matched.every(n=>n%32===0&&n>=256&&n<=2752));
const portrait=outputDimensions({baseWidth:1248,baseHeight:2688,composition:'reference',referenceWidth:655,referenceHeight:1024});
assert.ok(Math.abs((portrait[0]/portrait[1])/(655/1024)-1)<=0.01);
assert.ok(portrait[0]*portrait[1]<=1248*2688);
assert.deepEqual(outputDimensions({baseWidth:1248,baseHeight:2688,composition:'preset',referenceWidth:655,referenceHeight:1024}),[1248,2688]);

const tall=outputDimensions({baseWidth:2048,baseHeight:2048,composition:'tall'});
const wide=outputDimensions({baseWidth:2048,baseHeight:2048,composition:'wide'});
assert.ok(Math.abs(tall[0]/tall[1]-1/3)<=0.01);
assert.ok(Math.abs(wide[0]/wide[1]-3)<=0.01);
for(const size of [tall,wide,matched])assert.ok(size[0]*size[1]<=MAX_IMAGE_PIXELS);

for(const composition of ['preset','reference','tall','wide']){
 const [width,height]=outputDimensions({baseWidth:2560,baseHeight:1600,composition,referenceWidth:16,referenceHeight:9,preview:true});
 assert.ok(width*height<=PREVIEW_PIXELS,`${composition} preview stays under budget`);
 assert.ok(width%32===0&&height%32===0);
}
assert.throws(()=>outputDimensions({baseWidth:1024,baseHeight:1024,composition:'reference'}),/请先添加/);
assert.deepEqual(fitAspectSize(1,512*512),[512,512]);
console.log('PASS: reference aspect match, ultralong/ultrawide aspect, aligned dimensions, image/pixel caps, and preview budget.');
