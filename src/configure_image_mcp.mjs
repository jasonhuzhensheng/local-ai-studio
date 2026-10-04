import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { root } from './image_worker.mjs';

const configPath = path.join(os.homedir(), '.lmstudio/mcp.json');
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
const backup = path.join(root, '.local', `mcp-backup-${Date.now()}.json`);
fs.mkdirSync(path.dirname(backup), {recursive:true});
fs.writeFileSync(backup, JSON.stringify(config, null, 2), {mode:0o600});
config.mcpServers ??= {};
config.mcpServers['local-qwen-image'] = {
  command: process.execPath,
  args: [path.join(root, 'src/image_mcp.mjs')]
};
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', {mode:0o600});
console.log('Registered local-qwen-image. Backup: ' + backup);
