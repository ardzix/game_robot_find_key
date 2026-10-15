import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_PATH || 'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const browser = await chromium.launch({executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--enable-unsafe-swiftshader']});
const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
const page = await context.newPage();
const results = [];
const snapshot = () => page.evaluate(() => window.robotApp.getSnapshot());
const check = async (name, action) => { try { await action(); results.push({name, passed: true}); console.log('PASS ' + name); } catch (e) { results.push({name, passed: false, error: e.message}); throw e; } };
let fatal;
try {
  await page.goto('http://127.0.0.1:4186', {waitUntil: 'networkidle'});
  await page.waitForFunction(() => !!window.robotApp);
  await page.locator('#start-button').click();
  await check('locking classroom while a command animates cancels and rewinds it', async () => {
    await page.evaluate(() => {
      window.robotApp.applyConfig({...window.robotApp.getConfig(), queue: ['forward', 'forward']});
      window.robotApp.run();
      document.querySelector('#teacher-button').click();
      document.querySelectorAll('#teacher-dialog details').forEach(element => { element.open = true; });
      document.querySelector('#class-lock').click();
    });
    await page.waitForTimeout(1000);
    const locked = await snapshot();
    assert.equal(locked.classLocked, true); assert.equal(locked.running, false); assert.equal(locked.animating, false);
    assert.equal(locked.state.x, 0); assert.equal(locked.state.y, 2); assert.equal(locked.cursor, 0);
  });
  const before = await snapshot();
  const proposed = {version: 1, levelId: 2, queue: ['forward', 'forward', 'take'], playMode: 'step', musicVolume: .2, effectsVolume: .45, muted: false};
  await check('draft records proposed logic and anonymous prediction without applying or running', async () => {
    await page.locator('#config-editor').fill(JSON.stringify(proposed));
    await page.locator('#prediction').fill('Uji persiapan: robot akan mengambil kunci setelah dua langkah.');
    await page.locator('#save-draft').click();
    const after = await snapshot();
    assert.deepEqual(after.state, before.state); assert.deepEqual(after.queue, before.queue);
    assert.equal(after.running, false); assert.equal(after.classLocked, true); assert.equal(after.classAuthorized, false);
    const state = await page.evaluate(() => window.robotApp.getClassState());
    assert.equal(state.pendingConfig.levelId, 2); assert.equal(state.proposalStatus, 'draft_only');
    assert.equal(state.predictionsWithoutIdentity.length, 1);
  });
  await check('reopening teacher panel retains pending draft rather than live board config', async () => {
    await page.locator('#close-teacher').click();
    await page.locator('#teacher-button').click();
    const editor = JSON.parse(await page.locator('#config-editor').inputValue());
    assert.equal(editor.levelId, proposed.levelId); assert.deepEqual(editor.queue, proposed.queue);
  });
  await check('locked classroom rejects run, reset, direct edits, and wrong phrase', async () => {
    const result = await page.evaluate(() => ({reset: window.robotApp.reset(), enqueue: window.robotApp.enqueue('forward'), config: window.robotApp.applyConfig(window.robotApp.getConfig())}));
    assert.equal(result.reset, false); assert.equal(result.enqueue, false); assert.equal(result.config.valid, false);
    assert.equal(await page.evaluate(() => window.robotApp.run()), false);
    await page.locator('#permission-phrase').fill('izin belum cocok');
    await page.locator('#authorize-class').click();
    assert.equal((await snapshot()).classAuthorized, false);
    assert.deepEqual((await snapshot()).state, before.state);
  });
  await check('unsaved editor changes cannot authorize an older saved plan', async () => {
    await page.locator('#config-editor').fill(JSON.stringify({...proposed, queue: ['right']}));
    await page.locator('#permission-phrase').fill('Ayo om pit eksekusi buat game nya');
    await page.locator('#authorize-class').click();
    assert.equal((await snapshot()).classAuthorized, false);
    assert.deepEqual((await snapshot()).state, before.state);
    await page.locator('#config-editor').fill(JSON.stringify(proposed));
  });
  await check('exact preparation-test phrase applies only saved valid plan and does not auto-run', async () => {
    await page.locator('#permission-phrase').fill('Ayo om pit eksekusi buat game nya');
    await page.locator('#authorize-class').click();
    const after = await snapshot();
    assert.equal(after.classAuthorized, true); assert.equal(after.state.levelId, 2);
    assert.deepEqual(after.queue, proposed.queue); assert.equal(after.cursor, 0); assert.equal(after.running, false);
    assert.equal(after.mode, 'step');
    await page.locator('#close-teacher').click();
    await page.locator('#step-button').click();
    await page.waitForFunction(() => !window.robotApp.getSnapshot().animating);
    assert.equal((await snapshot()).cursor, 1);
    assert.equal((await page.evaluate(() => window.robotApp.getClassState())).testResults.length, 1);
  });
  await check('reload retains draft but revokes authorization and keeps audio locked', async () => {
    await page.reload({waitUntil: 'networkidle'});
    await page.waitForFunction(() => !!window.robotApp);
    const after = await snapshot();
    assert.equal(after.classLocked, true); assert.equal(after.classAuthorized, false); assert.equal(after.started, false);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'not-created');
    await page.locator('#start-button').click();
    assert.equal(await page.locator('#teacher-dialog').isVisible(), true);
    assert.equal((await snapshot()).started, false);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'not-created');
  });
  await check('authorization in a fresh locked page still requires explicit Mulai gesture for audio', async () => {
    await page.getByText('Konfigurasi lokal (JSON)', {exact: true}).click();
    await page.getByText('Rancangan sesi kelas', {exact: true}).click();
    const editor = JSON.parse(await page.locator('#config-editor').inputValue());
    assert.equal(editor.levelId, proposed.levelId); assert.deepEqual(editor.queue, proposed.queue);
    await page.locator('#permission-phrase').fill('Ayo om pit eksekusi buat game nya');
    await page.locator('#authorize-class').click();
    assert.equal((await snapshot()).classAuthorized, true);
    assert.equal((await snapshot()).started, false);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'not-created');
    await page.locator('#start-button').click();
    await page.waitForFunction(() => window.robotApp.audio.getStatus().contextState === 'running');
    assert.equal((await snapshot()).started, true); assert.equal((await snapshot()).cursor, 0);
  });
  await check('clear isolated test storage returns clean preparation defaults', async () => {
    await page.evaluate(() => localStorage.removeItem('robot-class-draft-v1'));
    await page.reload({waitUntil: 'networkidle'});
    await page.waitForFunction(() => !!window.robotApp);
    const clean = await snapshot();
    assert.equal(clean.classLocked, false); assert.equal(clean.classAuthorized, false); assert.equal(clean.started, false);
    assert.equal(clean.state.levelId, 1); assert.equal(clean.queue.length, 0);
  });
} catch (e) { fatal = e; }
finally {
  await mkdir(path.join(root, 'test-results'), {recursive: true});
  await writeFile(path.join(root, 'test-results', 'class-controls-report.json'), JSON.stringify({testedAt: new Date().toISOString(), browser: await browser.version(), checks: results, note: 'Permission phrase used only in an isolated preparation QA browser context; not a real classroom authorization.'}, null, 2) + '\n');
  await browser.close();
}
if (fatal) { console.error(fatal); process.exitCode = 1; }
