"""Build actual native H3 reference connections from job-owned files."""
import shutil
from PIL import Image

def apply_references(workflow,job,directory,base):
    variant=job.get('modelVariant','fl2va')
    if variant not in ('fl2va','ref2va'): raise ValueError('Unknown H3 variant')
    refs=job.get('referenceIds',[])
    if not isinstance(refs,list) or len(refs)>9: raise ValueError('Ref2VA supports at most 9 images')
    if variant=='ref2va':
        if not (base/'ref2va-verified.json').is_file(): raise ValueError('Ref2VA verification missing')
        workflow['1']['inputs']['unet_name']='minimax_h3_ref2va_pruned_bf16.safetensors'
        inputs=workflow['4']['inputs'];workflow['4']={'class_type':'MiniMaxH3ReferenceToVideo','inputs':inputs}
        inputs['ref_image_size']='match'
        items=[('ref_'+str(i),'ref_images.ref_image_'+str(i)) for i in range(len(refs))]
    else:
        items=[(role,'first_frame' if role=='firstFrame' else 'last_frame') for role in ('firstFrame','lastFrame') if job.get(role)]
    for index,(filename,input_name) in enumerate(items):
        source=directory/(filename+'.png')
        with Image.open(source) as im:
            if max(im.size)>2048:raise ValueError('Reference image exceeds 2048px')
            im.verify()
        target=base/'ComfyUI/input'/(job['id']+'-'+filename+'.png');target.parent.mkdir(exist_ok=True)
        shutil.copy2(source,target)
        node=str(20+index);workflow[node]={'class_type':'LoadImage','inputs':{'image':target.name}}
        workflow['4']['inputs'][input_name]=[node,0]
