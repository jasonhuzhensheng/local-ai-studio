import { McpServer } from '../.local/cline-runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/server/mcp.js';
import { StdioServerTransport } from '../.local/cline-runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.js';
import { z } from '../.local/cline-runtime/node_modules/zod/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { root } from './image_paths.mjs';
import { submitImage } from './image_submit.mjs';
import { readJob } from './image_jobs.mjs';

const server = new McpServer({name:'local-qwen-image',version:'2.0.0'});
const text = value => ({content:[{type:'text',text:JSON.stringify(value)}]});
try { await fetch('http://127.0.0.1:1235/', {signal:AbortSignal.timeout(1500)}); }
catch {
  const gallery=spawn(process.execPath,[path.join(root,'src/image_gallery.mjs')],{detached:true,stdio:'ignore'});
  gallery.on('error',()=>{});gallery.unref();
}
const parameters={prompt:z.string().min(1).max(6000),negative_prompt:z.string().max(6000).optional(),
  width:z.number().int().min(256).max(2752).multipleOf(32).default(512),
  height:z.number().int().min(256).max(2752).multipleOf(32).default(512),
  steps:z.number().int().min(1).max(50).default(20),seed:z.number().int().min(0).max(2147483647).optional()};
server.registerTool('generate_image',{
  description:'Generate with local Qwen Image 2.1. Default 512x512,20 steps. Queued jobs run sequentially. Return viewerUrl as a clickable Markdown link; the studio shows all jobs and images. Optional negative_prompt. Never claim completion before checking status.',
  inputSchema:parameters
},async args=>text(submitImage(args)));
server.registerTool('edit_image',{
  description:'Edit using 1 to 10 local reference images, in reference_ids order. Upload at http://127.0.0.1:1235/edit first. Do not invent IDs or assume chat attachments are accessible. Accepts legacy reference_id. Return viewerUrl as a clickable link. Defaults512x512,20 steps.',
  inputSchema:{...parameters,reference_id:z.string().uuid().optional(),reference_ids:z.array(z.string().uuid()).min(1).max(10).optional()}
},async args=>{if(!args.reference_id&&!args.reference_ids?.length)throw Error('请选择参考图');return text(submitImage(args));});
server.registerTool('get_image_status',{
  description:'Read queued/running/completed/failed image job. Completed returns the PNG image.',
  inputSchema:{id:z.string().uuid()}
},async({id})=>{
  const job=readJob(id),result=text({...job,viewerUrl:`http://127.0.0.1:1235/jobs/${id}`});
  if(job.status==='completed')result.content.push({type:'image',mimeType:'image/png',data:fs.readFileSync(job.image).toString('base64')});
  return result;
});
await server.connect(new StdioServerTransport());
