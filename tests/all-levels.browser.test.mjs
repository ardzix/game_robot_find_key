import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import { LEVELS } from '../levels.js';
import { expandQueue } from '../engine.js';

assert.equal(LEVELS.length, 50, 'This acceptance suite requires the final 50-level collection.');
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output = path.join(root, 'test-results');
await mkdir(output, {recursive: true});
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_PATH || 'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const browser = await chromium.launch({executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--enable-unsafe-swiftshader']});
const context = await browser.newContext({viewport: {width: 1366, height: 768}, serviceWorkers: 'block'});
const externalRequests = [], localRequests = new Set(), browserErrors = [], accelerated = [], fullDuration = [], independentPaths = [];
const startedAt = new Date().toISOString();
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.hostname !== '127.0.0.1') { externalRequests.push(url.href); return route.abort('internetdisconnected'); }
  localRequests.add(url.href); return route.continue();
});
const page = await context.newPage();
page.on('pageerror', error => browserErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()); });
const report = async (finished = false, failure = null) => writeFile(path.join(output, 'all50-browser-report.json'), JSON.stringify({startedAt, updatedAt: new Date().toISOString(), finished, failure, browser: await browser.version(), headless: true, softwareWebGL: true, externalHostsBlocked: true, physicalNetworkDisconnected: false, animationPolicy: {all50Integration: 'Only scene.motion.duration set to 12ms by test wrapper; actual renderer completion, app queue, engine rules, resets and success state unchanged. This is accelerated integration, not real-time classroom animation.', representativeLevels: 'Unmodified production animate function: 650ms per command and 1650ms success.'}, independentPaths, accelerated, fullDuration, externalRequests, browserErrors, localRequests: [...localRequests]}, null, 2) + '\n');

// Independent graph search: no game engine state transition function used here.
function shortestRoute(level) {
  const vectors = [[0,-1],[1,0],[0,1],[-1,0]], dirs = ['N','E','S','W'];
  const walls = new Set(level.obstacles.map(p => p.x + ',' + p.y));
  const encode = s => `${s.x},${s.y},${s.d},${s.k}`;
  const initial = {x: level.start.x, y: level.start.y, d: dirs.indexOf(level.start.dir), k: false};
  const queue = [{state: initial, route: []}], visited = new Set([encode(initial)]);
  for (let index = 0; index < queue.length; index++) {
    const {state, route} = queue[index];
    if (state.k && state.x === level.chest.x && state.y === level.chest.y) return [...route, 'open'];
    const neighbors = [['left', {...state, d: (state.d + 3) % 4}], ['right', {...state, d: (state.d + 1) % 4}]];
    const [dx,dy] = vectors[state.d], x = state.x + dx, y = state.y + dy;
    if (x >= 0 && y >= 0 && x < level.width && y < level.height && !walls.has(x + ',' + y)) neighbors.push(['forward', {...state,x,y}]);
    if (!state.k && state.x === level.key.x && state.y === level.key.y) neighbors.push(['take', {...state,k:true}]);
    for (const [command,next] of neighbors) { const key=encode(next); if (!visited.has(key)) { visited.add(key); queue.push({state:next,route:[...route,command]}); } }
  }
  throw new Error(`Level ${level.id} has no independent BFS route.`);
}
async function load() {
  await page.goto('http://127.0.0.1:4186', {waitUntil:'networkidle'});
  await page.waitForFunction(() => !!window.robotApp);
  assert.equal(await page.evaluate(() => window.robotApp.audio.getStatus().contextState), 'not-created');
  await page.locator('#start-button').click();
}
async function configure(level) {
  const queue = level.programSolution || level.solution;
  const applied = await page.evaluate(config => window.robotApp.applyConfig(config), {version:1,levelId:level.id,queue,playMode:'sequence',musicVolume:0,effectsVolume:0,muted:true});
  assert.equal(applied.valid, true, `Level ${level.id} program accepted: ${JSON.stringify(applied.errors)}`);
  const before = await page.evaluate(() => window.robotApp.getSnapshot());
  assert.equal(before.state.levelId, level.id); assert.equal(before.state.won, false); assert.equal(before.cursor,0);
  return queue;
}
async function solve(level, target) {
  const queue = await configure(level), count = expandQueue(queue).length;
  const start = Date.now();
  await page.locator('#run-button').click();
  await page.waitForFunction(() => { const state=window.robotApp.getSnapshot(); return !state.running && !state.animating; }, null, {timeout:120000});
  const after = await page.evaluate(() => window.robotApp.getSnapshot());
  assert.equal(after.state.won,true,`Level ${level.id} did not win at cursor${after.cursor}`);
  assert.equal(after.state.hasKey,true); assert.equal(after.state.x,level.chest.x); assert.equal(after.state.y,level.chest.y);
  assert.equal(after.cursor,count,`Expanded cursor counts every step on level ${level.id}`);
  assert.equal(await page.locator('#celebration').isVisible(),true);
  const item={levelId:level.id,grade:level.grade,visibleBlocks:queue.length,expandedCommands:count,usedRepeat:queue.some(command=>typeof command==='object'),elapsedMs:Date.now()-start,finalState:after.state,passed:true};
  target.push(item); await report(); console.log(`PASS level${level.id} ${target===accelerated?'accelerated':'normal'}: ${count} commands, ${item.elapsedMs}ms`);
}
let fatal;
try {
  for (const level of LEVELS) {
    const route = shortestRoute(level);
    assert.equal(route.length,level.shortestCommandCount,`Independent shortest count level${level.id}`);
    assert.equal(level.solution.length,route.length,`Published route shortest level${level.id}`);
    independentPaths.push({levelId:level.id,shortestCommandCount:route.length,reachable:true});
  }
  await load();
  await page.evaluate(() => {
    const scene=window.robotApp.scene;
    window.__qaOriginalAnimate=scene.animate;
    scene.animate=function(...args){const promise=window.__qaOriginalAnimate.apply(this,args);if(this.motion)this.motion.duration=12;return promise;};
  });
  for (const level of LEVELS) await solve(level,accelerated);
  // Reload forces fresh modules and a fresh audio gesture, and removes test timing wrapper.
  await load();
  for (const id of [1,7,13,19,25,31,37,44,50]) {
    const level = LEVELS.find(candidate=>candidate.id===id);
    await configure(level);
    await page.screenshot({path:path.join(output,`level-${String(id).padStart(2,'0')}-normal-start.png`),fullPage:true});
    await solve(level,fullDuration);
    await page.screenshot({path:path.join(output,`level-${String(id).padStart(2,'0')}-normal-solved.png`),fullPage:true});
  }
  assert.deepEqual(externalRequests,[]); assert.deepEqual(browserErrors,[]);
  await report(true);
} catch (error) {
  fatal=error; await page.screenshot({path:path.join(output,'all50-browser-failure.png'),fullPage:true}).catch(()=>{});
  await report(false,error.message);
} finally { await browser.close(); }
if(fatal){console.error(fatal);process.exitCode=1;}
