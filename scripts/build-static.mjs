import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output = path.join(root, 'dist');
const files = [
  'index.html', 'style.css', 'app.js', 'engine.js', 'levels.js', 'scene.js', 'audio.js',
  'assets/robot.svg', 'assets/music.mid', 'assets/music-preview.wav', 'assets/music-score.json',
  'vendor/three.module.min.js', 'vendor/THREE-LICENSE.txt', 'LICENSE',
];

// Only browser files belong in the deployed output. Fail on unexpected old output
// instead of publishing a server, runtime, checkpoint, or saved classroom data.
async function checkOutput(directory, prefix = '') {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const entry of entries) {
    const relative = prefix + entry.name;
    if (entry.isDirectory() && files.some(file => file.startsWith(relative + '/'))) {
      await checkOutput(path.join(directory, entry.name), relative + '/');
    } else if (!entry.isFile() || !files.includes(relative)) {
      throw new Error(`Unexpected build output: dist/${relative}. Use a fresh dist directory.`);
    }
  }
}

const contents = await Promise.all(files.map(file => readFile(path.join(root, file))));
await checkOutput(output);
for (const [index, file] of files.entries()) {
  const target = path.join(output, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents[index]);
}
console.log(`Static build: ${files.length} browser files in dist/; no server functions.`);
