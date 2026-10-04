import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Isolated storage is used by integration tests; production uses .local.
export const dataRoot = process.env.LOCAL_IMAGE_DATA_DIR || path.join(root, '.local');
export const jobs = path.join(dataRoot, 'image-jobs');
export const references = path.join(dataRoot, 'image-references');
export const binary = path.join(root, '.local/stable-diffusion.cpp/build/bin/sd-cli');
export const models = process.env.LOCAL_IMAGE_MODELS_DIR || path.join(root, '.local/image-models');
export const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export function jobDir(id) {
  if (!uuidPattern.test(id)) throw Error('任务编号不正确');
  return path.join(jobs, id);
}
