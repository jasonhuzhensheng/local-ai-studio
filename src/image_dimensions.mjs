const ALIGNMENT = 32;
const MIN_EDGE = 256;
const MAX_EDGE = 2752;
export const MAX_IMAGE_PIXELS = 4_325_376;
export const PREVIEW_PIXELS = 393_216;

/** Fit an aspect ratio to aligned dimensions without exceeding the pixel/edge caps. */
export function fitAspectSize(aspectRatio, pixelBudget, {maxPixels=MAX_IMAGE_PIXELS,maxEdge=MAX_EDGE}={}) {
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) throw Error('画布比例无效');
  if (!Number.isFinite(pixelBudget) || pixelBudget < MIN_EDGE * MIN_EDGE) throw Error('像素预算过小');
  const limit = Math.min(Math.floor(pixelBudget), maxPixels, maxEdge * maxEdge);
  const candidates=[];
  for(let width=MIN_EDGE;width<=maxEdge;width+=ALIGNMENT){
    const idealHeight=width/aspectRatio;
    const rounded=Math.round(idealHeight/ALIGNMENT)*ALIGNMENT;
    for(const height of [rounded-ALIGNMENT,rounded,rounded+ALIGNMENT]){
      if(height<MIN_EDGE||height>maxEdge||width*height>limit)continue;
      const error=Math.abs((width/height)/aspectRatio-1);
      candidates.push({width,height,error,area:width*height});
    }
  }
  if(!candidates.length)throw Error('当前像素预算无法生成该画布比例，请提高分辨率');
  const close=candidates.filter(c=>c.error<=0.01);
  const pool=close.length?close:candidates;
  pool.sort((a,b)=>b.area-a.area||a.error-b.error);
  return [pool[0].width,pool[0].height];
}

export function outputDimensions({baseWidth,baseHeight,composition='preset',referenceWidth,referenceHeight,preview=false,maxPixels=MAX_IMAGE_PIXELS}){
  if(!Number.isInteger(baseWidth)||!Number.isInteger(baseHeight))throw Error('基础分辨率无效');
  const budget=Math.min(baseWidth*baseHeight,maxPixels,preview?PREVIEW_PIXELS:MAX_IMAGE_PIXELS);
  if(composition==='preset'){
    if(preview&&baseWidth*baseHeight>PREVIEW_PIXELS){
      const scale=Math.sqrt(PREVIEW_PIXELS/(baseWidth*baseHeight));
      let width=Math.max(MIN_EDGE,Math.floor(baseWidth*scale/ALIGNMENT)*ALIGNMENT);
      let height=Math.max(MIN_EDGE,Math.round(width*baseHeight/baseWidth/ALIGNMENT)*ALIGNMENT);
      while(width*height>PREVIEW_PIXELS){if(width>height)width-=ALIGNMENT;else height-=ALIGNMENT;}
      return [width,height];
    }
    return [baseWidth,baseHeight];
  }
  if(composition==='reference'){
    if(!Number.isFinite(referenceWidth)||!Number.isFinite(referenceHeight)||referenceWidth<=0||referenceHeight<=0)throw Error('请先添加参考图1，再选择跟随参考图比例');
    return fitAspectSize(referenceWidth/referenceHeight,budget,{maxPixels});
  }
  if(composition==='tall')return fitAspectSize(1/3,budget,{maxPixels});
  if(composition==='wide')return fitAspectSize(3,budget,{maxPixels});
  throw Error('画布比例选择无效');
}
