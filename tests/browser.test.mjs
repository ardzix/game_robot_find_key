import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import { LEVELS } from '../levels.js';
import { MAX_QUEUE_LENGTH } from '../engine.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output = path.join(root, 'test-results');
await mkdir(output, {recursive: true});
const playwrightPath = process.env.PLAYWRIGHT_PATH || 'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const executablePath = process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const {chromium} = await import(pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({executablePath, headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--enable-unsafe-swiftshader']});
const context = await browser.newContext({viewport: {width: 1920, height: 1080}, serviceWorkers: 'block'});
const externalRequests = [], requests = [], browserErrors = [], checks = [];
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  requests.push(url.href);
  if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') { externalRequests.push(url.href); return route.abort('internetdisconnected'); }
  return route.continue();
});
const page = await context.newPage();
page.on('pageerror', error => browserErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()); });
const snapshot = () => page.evaluate(() => window.robotApp.getSnapshot());
const settled = () => page.waitForFunction(() => !window.robotApp.getSnapshot().animating && !window.robotApp.getSnapshot().running, {timeout: 30000});
const configure = async (levelId, queue, playMode = 'sequence') => {
  const result = await page.evaluate(config => window.robotApp.applyConfig(config), {version: 1, levelId, queue, playMode, musicVolume: .22, effectsVolume: .5, muted: false});
  if (result?.valid === false || result?.ok === false) throw new Error(`Config rejected: ${JSON.stringify(result)}`);
};
const check = async (name, action) => {
  try { const detail = await action(); checks.push({name, passed: true, ...(detail === undefined ? {} : {detail})}); console.log(`PASS ${name}`); }
  catch (error) { checks.push({name, passed: false, error: error.message}); console.error(`FAIL ${name}: ${error.message}`); throw error; }
};
let fatal;
try {
  await page.goto('http://127.0.0.1:4186', {waitUntil: 'networkidle'});
  await page.waitForFunction(() => !!window.robotApp, {timeout: 30000});
  await check('cold load: no audio context before Mulai gesture', async () => {
    const before = await page.evaluate(() => ({snapshot: window.robotApp.getSnapshot(), audio: window.robotApp.audio.getStatus()}));
    assert.equal(before.snapshot.started, false);
    assert.equal(before.audio.contextState, 'not-created');
    assert.equal(before.audio.unlocked, false);
    return before.audio;
  });
  await check('Mulai gesture starts actual Web Audio context/music', async () => {
    await page.locator('#start-button').click();
    await page.waitForFunction(() => window.robotApp.audio.getStatus().contextState === 'running');
    assert.equal((await snapshot()).started, true);
    const audio = await page.evaluate(() => window.robotApp.audio.getStatus());
    assert.equal(audio.musicPlaying, true);
    assert.equal(audio.unlocked, true);
    return audio;
  });
  await page.screenshot({path: path.join(output, 'game-1920x1080.png'), fullPage: true});
  await check('TV-sized layout has no horizontal overflow at 1920x1080 and 1366x768', async () => {
    const sizes = [];
    for (const size of [{width: 1920, height: 1080}, {width: 1366, height: 768}]) {
      await page.setViewportSize(size);
      const metrics = await page.evaluate(() => ({scrollWidth: document.documentElement.scrollWidth, width: innerWidth, height: innerHeight, scrollHeight: document.documentElement.scrollHeight, cards: [...document.querySelectorAll('[data-command]')].map(button => ({text: button.textContent, width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height, font: getComputedStyle(button.querySelector('span')).fontSize}))}));
      assert.ok(metrics.scrollWidth <= size.width, `Horizontal overflow at ${size.width}`);
      assert.ok(metrics.cards.every(card => card.width >= 100 && card.height >= 64));
      sizes.push(metrics);
    }
    await page.screenshot({path: path.join(output, 'game-1366x768.png'), fullPage: true});
    await page.setViewportSize({width: 1920, height: 1080});
    return sizes;
  });
  for (const level of LEVELS.slice(0,3)) await check(`level ${level.id}: solution through rendered UI`, async () => {
    await configure(level.id, level.solution);
    await page.locator('#run-button').click();
    await page.waitForFunction(() => window.robotApp.getSnapshot().state.won, {timeout: 30000});
    await settled();
    const final = await snapshot();
    assert.equal(final.state.x, level.chest.x);
    assert.equal(final.state.y, level.chest.y);
    assert.equal(final.state.hasKey, true);
    assert.equal(final.cursor, level.solution.length);
    assert.equal(await page.locator('#celebration').isVisible(), true);
    await page.screenshot({path: path.join(output, `level-${level.id}-solved.png`), fullPage: true});
    return final.state;
  });
  await check('relative left turn then forward changes heading and position', async () => {
    await configure(1, ['left', 'forward']);
    await page.locator('#run-button').click(); await settled();
    const state = (await snapshot()).state;
    assert.equal(state.x, 0); assert.equal(state.y, 1); assert.equal(state.dir, 'N');
  });
  await check('obstacle cannot be crossed; blocked event is safe', async () => {
    await configure(LEVELS.length === 50 ? 12 : 3, ['forward', 'forward']);
    await page.locator('#run-button').click(); await settled();
    const state = (await snapshot()).state;
    assert.equal(state.x, 1); assert.equal(state.y, 3); assert.equal(state.won, false);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().lastEvent), 'blocked');
  });
  await check('chest without key remains locked and emits playful locked event', async () => {
    await configure(LEVELS.length === 50 ? 7 : 2, ['forward', 'forward', 'left', 'forward', 'forward', 'open']);
    await page.locator('#run-button').click(); await settled();
    const state = (await snapshot()).state;
    assert.equal(state.x, 2); assert.equal(state.y, 1); assert.equal(state.hasKey, false); assert.equal(state.won, false);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().lastEvent), 'locked');
  });
  await check('take command in wrong cell is safe', async () => {
    await configure(LEVELS.length === 50 ? 7 : 2, ['take']);
    await page.locator('#run-button').click(); await settled();
    const state = (await snapshot()).state;
    assert.equal(state.hasKey, false); assert.equal(state.x, 0); assert.equal(state.y, 3);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().lastEvent), 'missing');
  });
  await check('pause completes at most current command and can resume', async () => {
    await configure(1, ['forward', 'left', 'forward', 'right']);
    await page.evaluate(() => { window.robotApp.run(); window.robotApp.pause(); });
    await settled();
    const paused = await snapshot();
    assert.equal(paused.cursor, 1); assert.equal(paused.running, false);
    await page.waitForTimeout(800); assert.equal((await snapshot()).cursor, 1);
    await page.locator('#run-button').click(); await settled();
    assert.equal((await snapshot()).cursor, 4);
  });
  await check('step spam consumes exactly one command during animation', async () => {
    await configure(1, ['forward', 'left', 'forward'], 'step');
    await page.evaluate(() => { for (let i = 0; i < 25; i++) window.robotApp.step(); });
    await settled();
    const state = await snapshot();
    assert.equal(state.cursor, 1); assert.equal(state.state.x, 1); assert.equal(state.state.y, 2);
  });
  await check('run and enqueue spam does not duplicate motion or mutate queue', async () => {
    await configure(1, ['forward']);
    await page.evaluate(() => { window.robotApp.run(); for (let i = 0; i < 25; i++) { window.robotApp.run(); window.robotApp.enqueue('forward'); } });
    await settled();
    const state = await snapshot();
    assert.equal(state.cursor, 1); assert.equal(state.state.x, 1); assert.equal(state.queue.length, 1);
  });
  await check('reset during animation cancels stale callback and keeps queue', async () => {
    await configure(1, ['forward', 'forward']);
    await page.evaluate(() => { window.robotApp.run(); window.robotApp.reset(); });
    await page.waitForTimeout(1300);
    const state = await snapshot();
    assert.equal(state.state.x, 0); assert.equal(state.state.y, 2); assert.equal(state.cursor, 0); assert.equal(state.running, false); assert.equal(state.animating, false); assert.equal(state.queue.length, 2);
  });
  await check('clear queue restores initial board and enforces configured instruction cap', async () => {
    await page.locator('#clear-button').click();
    assert.equal((await snapshot()).queue.length, 0);
    await page.evaluate(limit => { for (let i = 0; i < limit + 4; i++) window.robotApp.enqueue('left'); }, MAX_QUEUE_LENGTH);
    assert.equal((await snapshot()).queue.length, MAX_QUEUE_LENGTH);
    await page.locator('#clear-button').click();
  });
  await check('invalid configuration is rejected atomically', async () => {
    const before = await snapshot();
    const result = await page.evaluate(() => window.robotApp.applyConfig({...window.robotApp.getConfig(), queue: ['teleport']}));
    assert.ok(result?.valid === false || result?.ok === false, 'Invalid config must explicitly fail');
    const after = await snapshot();
    assert.deepEqual(after.state, before.state); assert.deepEqual(after.queue, before.queue);
  });
  await check('mute and separate volume controls update live audio buses', async () => {
    await page.locator('#teacher-button').click();
    await page.locator('#music-volume').fill('0.1');
    await page.locator('#effects-volume').fill('0.8');
    await page.locator('#close-teacher').click();
    await page.waitForTimeout(120);
    const audio = await page.evaluate(() => window.robotApp.audio.getStatus());
    assert.equal(audio.musicVolume, .1); assert.equal(audio.effectsVolume, .8);
    await page.locator('#mute-button').click();
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().muted), true);
    await page.locator('#mute-button').click();
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().muted), false);
    return audio;
  });
  await check('actual audio graph produces music/SFX samples and mute produces silence', async () => {
    const energy = await page.evaluate(async () => {
      const audio = window.robotApp.audio;
      const analyser = audio.context.createAnalyser(); analyser.fftSize = 2048; audio.master.connect(analyser);
      const data = new Float32Array(analyser.fftSize);
      const sample = async (duration = 350) => { let peak = 0; const start = performance.now(); while (performance.now() - start < duration) { analyser.getFloatTimeDomainData(data); for (const value of data) peak = Math.max(peak, Math.abs(value)); await new Promise(r => setTimeout(r, 15)); } return peak; };
      audio.setMuted(false); audio.setVolumes(.3, .5); audio.startMusic();
      const music = await sample(800);
      audio.stopMusic(); await new Promise(r => setTimeout(r, 100));
      const sfx = {};
      for (const event of ['move', 'turn', 'key', 'locked', 'success']) { audio.play(event); sfx[event] = await sample(850); }
      audio.setMuted(true); audio.play('success'); await new Promise(r => setTimeout(r, 250)); const muted = await sample(250);
      audio.setMuted(false); audio.startMusic(); audio.master.disconnect(analyser);
      return {music, sfx, muted};
    });
    assert.ok(energy.music > .001, `Music has energy: ${energy.music}`);
    for (const [name, peak] of Object.entries(energy.sfx)) assert.ok(peak > .001, `${name} has audio energy: ${peak}`);
    assert.ok(energy.muted < .0001, `Muted output must be silent: ${energy.muted}`);
    return energy;
  });
  await check('suspended audio can recover through retry and explicit Mulai', async () => {
    await page.evaluate(() => window.robotApp.audio.context.suspend());
    await page.locator('#audio-retry').waitFor({state: 'visible'});
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'suspended');
    await page.locator('#audio-retry').click();
    await page.locator('#start-button').click();
    await page.waitForFunction(() => window.robotApp.audio.getStatus().contextState === 'running');
    assert.equal((await snapshot()).started, true);
    assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().musicPlaying), true);
  });
  await check('fresh reload works with external network requests blocked and no cache reliance', async () => {
    await context.clearCookies();
    await page.reload({waitUntil: 'networkidle'});
    await page.waitForFunction(() => !!window.robotApp);
    assert.equal((await snapshot()).started, false);
    await page.locator('#start-button').click();
    await configure(1, LEVELS[0].solution);
    await page.locator('#run-button').click();
    await page.waitForFunction(() => window.robotApp.getSnapshot().state.won); await settled();
    assert.deepEqual(externalRequests, []);
    return {externalRequests, uniqueLocalRequests: [...new Set(requests)].length};
  });
  await check('no browser JavaScript/console errors', async () => assert.deepEqual(browserErrors, []));
} catch (error) { fatal = error; await page.screenshot({path: path.join(output, 'browser-failure.png'), fullPage: true}).catch(() => {}); }
finally {
  await writeFile(path.join(output, 'browser-report.json'), JSON.stringify({testedAt: new Date().toISOString(), browser: await browser.version(), executablePath, headless: true, softwareWebGL: true, network: 'All external hosts blocked; local HTTP allowed. Physical network adapter was not disabled.', checks, externalRequests, browserErrors, requests: [...new Set(requests)]}, null, 2) + '\n');
  await browser.close();
}
if (fatal) { console.error(fatal); process.exitCode = 1; }
