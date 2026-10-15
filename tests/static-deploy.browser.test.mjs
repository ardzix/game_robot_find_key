import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
await mkdir(path.join(root, 'test-results'), { recursive: true });
const liveURL = process.env.STATIC_DEPLOY_URL;
const dist = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
assert.equal(config.framework, null);
assert.equal(config.outputDirectory, 'dist');
assert.equal(config.installCommand, '');
assert.equal(config.buildCommand, 'node scripts/build-static.mjs');
const build = spawnSync(process.execPath, ['scripts/build-static.mjs'], { cwd: root, encoding: 'utf8' });
assert.equal(build.status, 0, build.stderr);

async function list(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await list(path.join(directory, entry.name), name + '/'));
    else files.push(name);
  }
  return files;
}
const files = await list(dist);
assert.equal(files.length, 14);
assert.ok(files.includes('app.js') && files.includes('vendor/three.module.min.js'));
assert.ok(!files.some(file => /^(runtime|server|api|functions|config|checkpoints|tests|docs)(\/|\.)/.test(file)));
for (const file of files) assert.deepEqual(await readFile(path.join(dist, file)), await readFile(path.join(root, file)));

// This server only reads files. Executing app.js on Node would reproduce the
// Vercel failure; browser initialization must happen after it is served as JS.
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.mid': 'audio/midi', '.wav': 'audio/wav', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!files.includes(file)) { res.writeHead(404); res.end(); return; }
    const body = await readFile(path.join(dist, file));
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(500); res.end(); }
});
if (!liveURL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = liveURL ? new URL(liveURL).origin : `http://127.0.0.1:${server.address().port}`;
if (liveURL) assert.equal(new URL(base).protocol, 'https:');
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_PATH || 'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--enable-unsafe-swiftshader'] });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, serviceWorkers: 'block' });
const errors = [], external = [], checks = [
  { name: 'Vercel configuration selects Other and a static dist output', passed: true },
  { name: 'all 14 static files match source; no server/runtime/classroom state in output', passed: true },
];
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.origin === base) return route.continue();
  external.push(url.href); return route.abort();
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
let failure;
try {
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.match(response.headers()['content-type'], /text\/html/);
  const script = await context.request.get(base + '/app.js');
  assert.equal(script.status(), 200);
  assert.match(script.headers()['content-type'], /javascript/);
  assert.equal((await context.request.get(base + '/server.mjs')).status(), 404);
  assert.equal((await context.request.get(base + '/runtime/node.exe')).status(), 404);
  checks.push({ name: 'homepage and browser JS return 200; server/runtime are not published', passed: true });
  if (liveURL) {
    for (const file of files) {
      const response = await context.request.get(base + '/' + file);
      assert.equal(response.status(), 200, `${file} must be deployed`);
      const served = await response.body(), source = await readFile(path.join(dist, file));
      if (/\.(mid|wav)$/.test(file)) assert.deepEqual(served, source, `${file} must match the build`);
      else assert.equal(served.toString('utf8').replaceAll('\r\n', '\n'), source.toString('utf8').replaceAll('\r\n', '\n'), `${file} must match the build`);
    }
    checks.push({ name: 'all 14 deployed files match this repository build (text line endings normalized)', passed: true });
  }
  await page.waitForFunction(() => !!window.robotApp);
  assert.equal(await page.evaluate(() => window.robotApp.getLevels().length), 50);
  assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'not-created');
  await page.locator('#start-button').click();
  assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'running');
  checks.push({ name: 'static browser load exposes all 50 levels and audio unlocks only after Mulai', passed: true });
  for (const levelId of [1, 31, 50]) {
    const result = await page.evaluate(id => {
      const level = window.robotApp.getLevels().find(item => item.id === id);
      return window.robotApp.applyConfig({ version: 1, levelId: id, queue: level.programSolution, playMode: 'sequence', musicVolume: 0, effectsVolume: 0, muted: true });
    }, levelId);
    assert.equal(result.valid, true);
    if (levelId === 31) await page.screenshot({ path: path.join(root, `test-results/static-${liveURL ? 'live' : 'deploy'}-level-31.png`) });
    if (levelId === 31) await page.evaluate(() => {
      const scene = window.robotApp.scene, original = scene.animate;
      scene.animate = function (...args) { const result = original.apply(this, args); if (this.motion) this.motion.duration = 12; return result; };
    });
    await page.locator('#run-button').click();
    await page.waitForFunction(() => { const state = window.robotApp.getSnapshot(); return !state.running && !state.animating; }, null, { timeout: 60000 });
    assert.equal(await page.evaluate(() => window.robotApp.getSnapshot().state.won), true);
    checks.push({ name: `level ${levelId} solved from static dist`, passed: true, animation: levelId === 1 ? 'production timing' : '12ms test acceleration' });
  }
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.robotApp);
  assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'not-created');
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  checks.push({ name: 'fresh reload succeeds with no browser errors or external dependencies', passed: true });
} catch (error) { failure = error; checks.push({ name: 'static deployment browser smoke', passed: false, error: error.message }); }
finally {
  await mkdir(path.join(root, 'test-results'), { recursive: true });
  await writeFile(path.join(root, `test-results/static-${liveURL ? 'live' : 'deploy'}-report.json`), JSON.stringify({ testedAt: new Date().toISOString(), base, browser: await browser.version(), scope: liveURL ? 'Live HTTPS static deployment' : 'Local static hosting of the exact Vercel output; not a live Vercel deployment', checks, browserErrors: errors, externalRequests: external }, null, 2) + '\n');
  await browser.close(); if (server.listening) await new Promise(resolve => server.close(resolve));
}
if (failure) throw failure;
console.log(`${checks.length}/${checks.length} static-deployment checks passed.`);
