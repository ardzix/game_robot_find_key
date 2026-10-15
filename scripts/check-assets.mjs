import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const failures = [];
const inspected = [];
const references = [];
async function walk(dir) {
  const output = [];
  for (const item of await readdir(dir, {withFileTypes: true})) {
    if (['node_modules', 'checkpoints', '.git', 'runtime', 'tests', 'scripts', 'docs', 'test-results'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) output.push(...await walk(full));
    else if (item.isFile()) output.push(full);
  }
  return output;
}
for (const file of await walk(root)) {
  if (!/\.(html|m?js|css)$/.test(file) || path.basename(file) === 'server.mjs') continue;
  const text = await readFile(file, 'utf8');
  inspected.push(path.relative(root, file));
  const patterns = path.extname(file) === '.html'
    ? [/(?:src|href)\s*=\s*["']([^"']+)["']/g]
    : path.extname(file) === '.css'
      ? [/url\(\s*["']?([^\s"')]+)["']?\s*\)/g, /@import\s*["']([^"']+)["']/g]
      : [/(?:import|export)\s+(?:[^;]*?\s+from\s*)?["']([^"']+)["']/g, /(?:import|fetch)\(\s*["']([^"']+)["']/g, /new URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g];
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) {
    const ref = match[1];
    if (/^(data:|blob:|#)/.test(ref)) continue;
    references.push({source: path.relative(root, file), reference: ref});
    if (/^(https?:)?\/\//i.test(ref)) { failures.push(`${path.relative(root, file)} memerlukan jaringan: ${ref}`); continue; }
    const clean = ref.split(/[?#]/)[0];
    const target = clean.startsWith('/') ? path.resolve(root, '.' + clean) : path.resolve(path.dirname(file), clean);
    try { if (!(await stat(target)).isFile()) throw new Error('bukan berkas'); }
    catch { failures.push(`${path.relative(root, file)} aset hilang: ${ref}`); }
  }
}
for (const required of ['index.html', 'runtime/node.exe']) {
  try { await stat(path.join(root, required)); } catch { failures.push(`Berkas wajib hilang: ${required}`); }
}
console.log(JSON.stringify({ok: failures.length === 0, inspected, references, failures}, null, 2));
if (failures.length) process.exitCode = 1;
