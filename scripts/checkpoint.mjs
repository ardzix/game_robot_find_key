import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ignored = new Set(['checkpoints', 'node_modules', '.git', 'test-results']);
async function filesIn(dir, base = dir) {
  const files = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    if (ignored.has(entry.name) || entry.name.startsWith('.server')) continue;
    const full = path.join(dir, entry.name);
    const relative = path.relative(base, full).replaceAll('\\', '/');
    if (relative === 'vendor/package' || entry.name.endsWith('.tgz') || entry.name.endsWith('.zip') || entry.name === 'levels-50-draft.js') continue;
    if (entry.isDirectory()) files.push(...await filesIn(full, base));
    else if (entry.isFile()) files.push(path.relative(base, full).replaceAll('\\', '/'));
  }
  return files.sort();
}
async function copyVerified(source, destination, records) {
  await mkdir(destination, {recursive: false});
  for (const record of records) {
    const relative = record.path;
    if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error(`Path tidak aman: ${relative}`);
    const original = path.join(source, relative);
    const data = await readFile(original);
    const hash = createHash('sha256').update(data).digest('hex');
    if (hash !== record.sha256) throw new Error(`Hash tidak cocok: ${relative}`);
    const target = path.join(destination, relative);
    await mkdir(path.dirname(target), {recursive: true});
    await writeFile(target, data, {flag: 'wx'});
  }
}
if (process.argv[2] === '--restore') {
  const source = path.resolve(process.argv[3] || '');
  if (process.argv[4] !== '--to' || !process.argv[5]) throw new Error('Gunakan --restore PATH_CHECKPOINT --to FOLDER_BARU');
  const destination = path.resolve(process.argv[5]);
  const manifest = JSON.parse(await readFile(path.join(source, 'CHECKPOINT.json'), 'utf8'));
  await copyVerified(path.join(source, 'snapshot'), destination, manifest.files);
  console.log(`Dipulihkan ke folder baru: ${destination}\nBuka MULAI.cmd dari folder itu setelah menghentikan server lama.`);
} else {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const id = `baseline-${timestamp}-${randomBytes(3).toString('hex')}`;
  const directory = path.join(root, 'checkpoints', id);
  const files = [];
  for (const relative of await filesIn(root)) {
    const data = await readFile(path.join(root, relative));
    files.push({path: relative, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex')});
  }
  await mkdir(directory, {recursive: true});
  await copyVerified(root, path.join(directory, 'snapshot'), files);
  await writeFile(path.join(directory, 'CHECKPOINT.json'), JSON.stringify({id, createdAt: new Date().toISOString(), algorithm: 'SHA-256', files}, null, 2) + '\n', {flag: 'wx'});
  console.log(`Checkpoint baru (tidak menimpa): ${directory}\n${files.length} berkas; SHA-256 per berkas.`);
}
