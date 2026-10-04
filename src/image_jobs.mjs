import {videoBusy} from './video_jobs.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { jobs, root, jobDir, uuidPattern } from './image_paths.mjs';
import { retryReadSync } from './fs_read_retry.mjs';

export function saveJob(job) {
  const dir = jobDir(job.id), temp = path.join(dir, `status-${randomUUID()}.tmp`);
  fs.writeFileSync(temp, JSON.stringify(job, null, 2));
  fs.renameSync(temp, path.join(dir, 'status.json'));
}
export function alive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; }
  catch (error) { return error.code !== 'ESRCH'; }
}
export function parseGenerationLog(tail, enhancementStage) {
  if(tail.lastIndexOf('[viggle] DEPENDENCIES_START')>tail.lastIndexOf('[viggle] DEPENDENCIES_READY'))
    return {stage:'正在加载Python依赖（尚未开始生图）'};
  const enhancement=tail.lastIndexOf('[enhance] ');
  if(enhancement>=0||enhancementStage){
    const part=enhancement>=0?tail.slice(enhancement):tail,name=enhancementStage||part.split('\n')[0].replace('[enhance] ','');
    const m=[...part.matchAll(/(\d+)\/(\d+) - ([\d.]+)(?:s\/it|it\/s)/g)].at(-1);
    return {stage:name,enhanceProgress:m?{step:+m[1],total:+m[2]}:undefined};
  }
  const viggleDecode=tail.lastIndexOf('[viggle] VAE_DECODE');
  if(viggleDecode>=0){
    const part=tail.slice(0,viggleDecode),begin=part.lastIndexOf('generating image:');
    const sampling=begin<0?'':part.slice(begin);
    const m=[...sampling.matchAll(/(\d+)\/(\d+) - ([\d.]+)s\/it/g)].at(-1);
    return {progress:m?{step:+m[1],total:+m[2],secondsPerStep:+m[3]}:undefined,stage:'Viggle正在分块解码图片'};
  }
  const begin = tail.lastIndexOf('generating image:');
  const decode = /decoding \d+ latents|decode_first_stage/.test(tail);
  const decodeStart = /decoding \d+ latents/.exec(tail);
  const decodeTail = decodeStart ? tail.slice(decodeStart.index) : '';
  const d = [...decodeTail.matchAll(/(\d+)\/(\d+) - ([\d.]+)s\/it/g)].at(-1);
  const sampling = begin < 0 ? '' : tail.slice(begin).split(/sampling completed|decoding \d+ latents|decode_first_stage/)[0];
  const m = [...sampling.matchAll(/(\d+)\/(\d+) - ([\d.]+)s\/it/g)].at(-1);
  return {
    progress: m ? {step:+m[1],total:+m[2],secondsPerStep:+m[3]} : undefined,
    decodeProgress: d ? {step:+d[1],total:+d[2],secondsPerTile:+d[3]} : undefined,
    stage: decode ? '正在解码并保存图片' : m ? '正在生成' : begin >= 0 ? '正在开始采样，首步较慢' : '正在加载模型和参考图'
  };
}
export function readJob(id) {
  const dir = jobDir(id), job = JSON.parse(retryReadSync(()=>fs.readFileSync(path.join(dir, 'status.json'), 'utf8')));
  if (['starting', 'running'].includes(job.status) && !alive(job.workerPid)) {
    // A surviving generation child must finish before another job is scheduled.
    if (alive(job.generationPid)) job.orphaned = true;
    else if (job.status !== 'starting' || Date.now() - Date.parse(job.startedAt) > 10000) {
      job.status = 'failed'; job.error = '绘图进程已退出，请重新提交任务';
      job.finishedAt = new Date().toISOString(); saveJob(job);
    }
  }
  job.deleting = fs.existsSync(path.join(dir, 'delete.request'));
  const log = path.join(dir, 'generation.log');
  if (fs.existsSync(log) && ['starting', 'running'].includes(job.status)) {
    let fd;
    try {
      fd = retryReadSync(()=>fs.openSync(log, 'r'));
      const size = retryReadSync(()=>fs.fstatSync(fd)).size, b = Buffer.alloc(Math.min(size, 8192));
      retryReadSync(()=>fs.readSync(fd, b, 0, b.length, Math.max(0, size - b.length)));
      Object.assign(job, parseGenerationLog(b.toString(),job.enhanceStage));
      if(job.enhanceStage){job.stage=job.enhanceStage;delete job.progress;delete job.decodeProgress;}
    } catch(error) {
      if(!['EAGAIN','EINTR'].includes(error.code)&&error.errno!==-11)throw error;
      job.progressUnavailable=true;
    } finally { if(fd!==undefined)fs.closeSync(fd); }
  }
  return job;
}
export function listJobs() {
  fs.mkdirSync(jobs, {recursive: true});
  const all = [];
  for (const id of retryReadSync(()=>fs.readdirSync(jobs)).filter(id => uuidPattern.test(id))) {
    try { all.push(readJob(id)); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  const queued = all.filter(j => j.status === 'queued').sort((a,b) => a.createdAt.localeCompare(b.createdAt));
  queued.forEach((j,i) => { j.queuePosition = i+1; });
  return all.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
}
export function deleteJob(id) {
  const j = readJob(id), dir = jobDir(id);
  if (['running', 'starting'].includes(j.status)) {
    if (j.orphaned) throw Error('任务的管理进程已退出，绘图进程仍在运行；请等待其退出后删除');
    fs.writeFileSync(path.join(dir, 'delete.request'), '');
    return {id, deleting: true};
  }
  // Uploaded references live separately and are never removed with a result.
  fs.rmSync(dir, {recursive: true, force: true});
  return {id, deleted: true};
}
export function startNext(launch = (id) => spawn(process.execPath,
  [path.join(root, 'src/image_worker.mjs'), '--job', id], {detached:true, stdio:'ignore'})) {
  if(videoBusy())return;
  const all = listJobs();
  if (all.some(j => ['running', 'starting'].includes(j.status))) return;
  const lock = path.join(jobs, 'active.lock');
  // No live worker/child remains. This also recovers legacy stale locks.
  fs.rmSync(lock, {recursive: true, force: true});
  for (const j of all.filter(j => j.deleting)) fs.rmSync(jobDir(j.id), {recursive:true, force:true});
  const job = all.filter(j => j.status === 'queued' && !j.deleting).at(-1);
  if (!job) return;
  fs.mkdirSync(lock);
  job.status = 'starting'; job.startedAt = new Date().toISOString(); saveJob(job);
  try {
    const child = launch(job.id);
    job.workerPid = child.pid; saveJob(job);
    child.on('error', error => {
      job.status = 'failed'; job.error = error.message; saveJob(job);
      fs.rmSync(lock, {recursive:true, force:true});
    });
    child.unref();
  } catch (error) {
    job.status = 'failed'; job.error = error.message; saveJob(job);
    fs.rmSync(lock, {recursive:true, force:true});
  }
}
