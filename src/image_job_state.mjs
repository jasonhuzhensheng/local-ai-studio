export function reconcileJob(job) {
  if (job.status !== 'running' || !job.workerPid) return job;
  try { process.kill(job.workerPid, 0); }
  catch (error) {
    if (error.code === 'ESRCH') return {...job, status:'failed', error:'绘图进程已退出，任务未完成。请重新生成。'};
  }
  return job;
}
