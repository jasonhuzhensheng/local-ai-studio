export const dimensions={hd:{'16:9':[1280,736]},sample:{'1:1':[256,256],'16:9':[448,256],'21:9':[448,192],'4:3':[320,256],'3:4':[256,320],'9:16':[256,448]},standard:{'1:1':[656,656],'16:9':[864,496],'21:9':[1008,432],'4:3':[752,560],'3:4':[560,752],'9:16':[496,864]}};
export const frameOptions=[22,39,56,73,90,107,124,362];
export const deliveredFrames=frames=>frames===362?360:frames;
export function resolveVideoSettings(body){const ratio=body.ratio??'1:1',resolution=body.resolution??'sample',frames=body.frames??22;
 if(body.preset!==undefined&&body.preset!=='smoke')throw Error('视频规格不支持');
 if(!Object.hasOwn(dimensions,resolution)||!Object.hasOwn(dimensions[resolution],ratio))throw Error('比例或分辨率档位无效；HD仅支持16:9小样，Full HD尚未开放');
 if(!Number.isInteger(frames)||!frameOptions.includes(frames))throw Error('视频帧数须按17k+5网格选择；15秒输出360帧由362帧裁切');
 if(body.audio!==undefined&&typeof body.audio!=='boolean')throw Error('音频参数必须为布尔值');
 if(frames===362)throw Error('496×864、15秒带音频实测触发新增交换4GiB保护，未生成成片；此规格暂不能提交。');
 const standardPortrait=resolution==='standard'&&ratio==='9:16'&&frames===22;
 if(body.audio===true&&!((ratio==='1:1'&&resolution==='sample'&&frames===22)||standardPortrait))throw Error('音频仅支持已测方形小样或496×864标准竖屏的22帧短例');
 if(resolution==='hd'&&frames!==22)throw Error('HD仅开放已实测的22帧（0.92秒）无声小样');
 const [outputWidth,outputHeight]=dimensions[resolution][ratio],width=Math.ceil(outputWidth/32)*32,height=Math.ceil(outputHeight/32)*32,outputFrames=deliveredFrames(frames);
 if(resolution!=='hd'&&width*height*frames>12000000)throw Error('此尺寸与时长组合超过本机保守负载上限。请主动降低分辨率或缩短时长，系统不会自动更改参数。');
 return {ratio,resolution,width,height,outputWidth,outputHeight,frames,outputFrames,audio:body.audio===true,fps:24,steps:4,durationSeconds:outputFrames/24,experimental:!standardPortrait&&(width!==256||height!==256||frames!==22)};
}
