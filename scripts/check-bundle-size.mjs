import { gzipSync } from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const maxRawBytes = 250 * 1024;
const maxGzipBytes = 100 * 1024;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else files.push(path);
  }
  return files;
}

const files = await filesIn(dist);
if (files.some(file => file.endsWith('.map'))) {
  throw new Error('Sourcemaps must be removed before deploying dist');
}
let rawBytes = 0;
let gzipBytes = 0;
for (const file of files) {
  const content = await readFile(file);
  rawBytes += content.byteLength;
  gzipBytes += gzipSync(content).byteLength;
}

console.log(`Bundle size: ${(rawBytes / 1024).toFixed(1)} KiB raw, ${(gzipBytes / 1024).toFixed(1)} KiB gzip`);
if (rawBytes > maxRawBytes || gzipBytes > maxGzipBytes) {
  console.error(`Bundle size limit exceeded: raw <= ${maxRawBytes / 1024} KiB, gzip <= ${maxGzipBytes / 1024} KiB`);
  process.exit(1);
}

