import fs from 'node:fs';
import path from 'node:path';
import { ClineCore, getClineDefaultSystemPrompt } from '../.local/cline-runtime/node_modules/@cline/core/dist/index.js';

const cwd = path.resolve('.local/coding-smoke');
const demo = process.argv.includes('--demo');
const demoPrompt = '请只在当前示例项目内操作：新增 src/temperature.py，提供 celsius_to_fahrenheit(celsius) 函数；新增 tests/test_temperature.py，用 unittest 测试 0°C=32°F、100°C=212°F、-40°C=-40°F 和 37°C≈98.6°F。读取现有项目结构后创建这两个文件，不修改现有文件。执行 python3 -m unittest discover -s tests -v，确保全部测试通过。最后用中文说明新建了哪些文件和测试结果。不要安装依赖、联网、操作其他目录或创建子代理。';
const transcript = path.join(cwd, '演示过程.md');
if (demo) fs.writeFileSync(transcript, '# 本地 Qwen 编码演示\n\n这次演示通过 Cline 官方代理核心执行；不是 VS Code 面板内的聊天记录。\n\n## 我发给它的任务\n\n' + demoPrompt + '\n\n## 实际执行记录\n');
const log = fs.createWriteStream(path.resolve('.local/cline-smoke-events.jsonl'), { flags: 'a' });
const cline = await ClineCore.create({ clientName: 'local-model-smoke', backendMode: 'local' });
cline.subscribe(event => {
  log.write(JSON.stringify(event) + '\n');
  if (event.type === 'status' || (event.type === 'agent_event' &&
      event.payload.event.type === 'content_end' && event.payload.event.contentType === 'tool')) {
    console.log(JSON.stringify(event).slice(0, 1400));
  }
  if (demo && event.type === 'agent_event' && event.payload.event.type === 'content_end') {
    const e = event.payload.event;
    if (e.contentType === 'tool') fs.appendFileSync(transcript, '\n### 工具：' + e.toolName + '\n\n```json\n' + JSON.stringify(e.output, null, 2) + '\n```\n');
    if (e.contentType === 'text' && e.text) fs.appendFileSync(transcript, '\n' + e.text + '\n');
  }
});
try {
  const result = await cline.start({
    source: 'cli', interactive: false,
    config: {
      cwd, workspaceRoot: cwd, providerId: 'lmstudio', modelId: 'qwen3.8-27b-local',
      baseUrl: 'http://127.0.0.1:1234/v1',
      systemPrompt: getClineDefaultSystemPrompt({ workspaceRoot: cwd, cwd, mode: 'act' }),
      mode: 'act', enableTools: true, enableSpawnAgent: false, enableAgentTeams: false,
      yolo: true, maxTokensPerTurn: 4096, temperature: 0,
      checkpoint: { enabled: false }, maxSteps: 12,
    },
    prompt: demo ? demoPrompt : 'Work only in this coding-smoke workspace. Read src/calculator.py and tests/test_calculator.py using file tools. Run python3 -m unittest discover -s tests -v to observe failures. Fix sum_even in src/calculator.py so that all existing tests pass, without changing any tests. Run the same test command again and report the result. Do not install software, access other folders, use the browser, or create subagents.',
  });
  console.log('RESULT', JSON.stringify({sessionId: result.sessionId, finishReason: result.result?.finishReason}));
} finally {
  await cline.dispose();
  log.end();
}
