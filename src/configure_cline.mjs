import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ProviderSettingsManager } from '../.local/cline-runtime/node_modules/@cline/core/dist/index.js';

const data = path.join(os.homedir(), '.cline/data');
const statePath = path.join(data, 'globalState.json');
const providerPath = path.join(data, 'settings/providers.json');
const backup = path.resolve('.local/config-backup-' + Date.now());
fs.mkdirSync(backup, { recursive: true, mode: 0o700 });
for (const file of [statePath, providerPath]) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(backup, path.basename(file)));
}
const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};
Object.assign(state, {
  planModeApiProvider: 'lmstudio', actModeApiProvider: 'lmstudio',
  planModeLmStudioModelId: 'qwen3.8-27b-local', actModeLmStudioModelId: 'qwen3.8-27b-local',
  lmStudioBaseUrl: 'http://127.0.0.1:1234', lmStudioMaxTokens: 4096,
  customPrompt: 'compact',
});
fs.writeFileSync(statePath + '.local-setup.tmp', JSON.stringify(state, null, 2));
fs.renameSync(statePath + '.local-setup.tmp', statePath);
const manager = new ProviderSettingsManager({ filePath: providerPath });
manager.saveProviderSettings({
  provider: 'lmstudio', model: 'qwen3.8-27b-local',
  baseUrl: 'http://127.0.0.1:1234/v1', protocol: 'openai-chat',
}, { setLastUsed: true, tokenSource: 'manual' });
console.log(JSON.stringify({ backup, legacy: 'lmstudio', sdk: manager.getLastUsedProviderSettings() }, null, 2));
