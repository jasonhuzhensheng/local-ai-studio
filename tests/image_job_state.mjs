import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { reconcileJob } from '../src/image_job_state.mjs';

assert.equal(reconcileJob({status:'running',workerPid:process.pid}).status,'running');
const child=spawn(process.execPath,['-e','process.exit(0)']);
await once(child,'exit');
assert.equal(reconcileJob({status:'running',workerPid:child.pid}).status,'failed');
assert.equal(reconcileJob({status:'completed',workerPid:child.pid}).status,'completed');
console.log('PASS: live worker, exited worker, completed job.');
