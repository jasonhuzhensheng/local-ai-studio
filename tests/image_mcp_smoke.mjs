import assert from 'node:assert/strict';
import { Client } from '../.local/cline-runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../.local/cline-runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import path from 'node:path';
import { root, imageArgs } from '../src/image_worker.mjs';

const client = new Client({name:'image-smoke', version:'1.0.0'});
await client.connect(new StdioClientTransport({command:process.execPath, args:[path.join(root,'src/image_mcp.mjs')]}));
try {
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map(t=>t.name).sort(), ['edit_image','generate_image','get_image_status']);
  const invalid = await client.callTool({name:'get_image_status', arguments:{id:'../../outside'}});
  assert.equal(invalid.isError, true);
  const invalidSize = await client.callTool({name:'generate_image', arguments:{prompt:'test',width:513}});
  assert.equal(invalidSize.isError, true);
  const prompt = 'a cat; $(touch /tmp/should-not-exist)';
  const args = imageArgs({prompt,width:512,height:512,steps:20,seed:42}, '/tmp/example.png');
  assert.equal(args[args.indexOf('-p') + 1], prompt);
  console.log('PASS: MCP discovery, invalid job/path rejection, invalid dimensions, literal prompt argument.');
  if (process.argv.includes('--generate')) {
    const result = await client.callTool({name:'generate_image',arguments:{prompt:'A small orange cat sitting on a wooden windowsill, soft morning light, watercolor illustration',width:512,height:512,steps:20,seed:42}});
    console.log(JSON.stringify(result));
    assert.ok(!result.isError);
  }
} finally { await client.close(); }
