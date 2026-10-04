import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '../.local/cline-runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../.local/cline-runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { root } from '../src/image_worker.mjs';

// Checks the real local model -> MCP -> rendering path; not a GUI test.
const client = new Client({name:'image-model-smoke',version:'1.0.0'});
await client.connect(new StdioClientTransport({command:process.execPath,args:[path.join(root,'src/image_mcp.mjs')]}));
try {
  const {tools} = await client.listTools();
  const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'qwen3.8-27b-local',temperature:0,max_tokens:1024,
      messages:[{role:'user',content:'请调用 generate_image 一次，生成一张坐在木质窗台上的橘猫水彩画，柔和晨光。尺寸512×512，20步，seed=42。不要只描述图片，请实际调用绘图工具。'}],
      tools:tools.map(t=>({type:'function',function:{name:t.name,description:t.description,parameters:t.inputSchema}}))})
  });
  if (!response.ok) throw new Error(`LM Studio HTTP ${response.status}: ${await response.text()}`);
  const result = await response.json();
  const calls = result.choices[0].message.tool_calls;
  assert.equal(calls?.length,1,'Model must call exactly one tool');
  assert.equal(calls[0].function.name,'generate_image');
  const args = JSON.parse(calls[0].function.arguments);
  assert.equal(args.width,512); assert.equal(args.height,512); assert.equal(args.steps,20);
  const output = await client.callTool({name:'generate_image',arguments:args});
  assert.ok(!output.isError,JSON.stringify(output));
  const record = {testedAt:new Date().toISOString(),model:result.model,tool:'generate_image',arguments:args,result:output};
  fs.writeFileSync(path.join(root,'.local/image-model-smoke.json'),JSON.stringify(record,null,2));
  console.log(JSON.stringify(record));
} finally { await client.close(); }
