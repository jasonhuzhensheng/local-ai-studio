import assert from 'node:assert/strict';
import { retryReadSync } from '../src/fs_read_retry.mjs';

let attempts=0;
assert.equal(retryReadSync(()=>{attempts++;if(attempts<3){const error=Error('transient');error.errno=-11;throw error;}return 'ok';}), 'ok');
assert.equal(attempts,3);
attempts=0;
assert.throws(()=>retryReadSync(()=>{attempts++;const error=Error('missing');error.code='ENOENT';throw error;}),{code:'ENOENT'});
assert.equal(attempts,1,'permanent read errors should not be retried');
console.log('Transient filesystem read retry and permanent error handling passed.');
