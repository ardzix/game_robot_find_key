import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import { LEVELS, LEVEL_GROUPS } from '../levels.js';
import { MAX_EXPANDED_LENGTH } from '../engine.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output=path.join(root,'test-results');await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH||'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1366,height:768},serviceWorkers:'block'});
const external=[],errors=[],checks=[],upperPrimitive=[];
await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1')return route.continue();external.push(url.href);return route.abort();});
const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
const snapshot=()=>page.evaluate(()=>window.robotApp.getSnapshot());
const configure=async(levelId,queue=[])=>{const result=await page.evaluate(config=>window.robotApp.applyConfig(config),{version:1,levelId,queue,playMode:'sequence',musicVolume:0,effectsVolume:0,muted:true});assert.equal(result.valid,true,JSON.stringify(result.errors));};
const check=async(name,action)=>{try{const detail=await action();checks.push({name,passed:true,...(detail===undefined?{}:{detail})});console.log('PASS '+name);}catch(error){checks.push({name,passed:false,error:error.message});throw error;}};
const settle=()=>page.waitForFunction(()=>{const s=window.robotApp.getSnapshot();return !s.animating&&!s.running;},null,{timeout:30000});
let fatal;
try{
  await page.goto('http://127.0.0.1:4186',{waitUntil:'networkidle'});await page.waitForFunction(()=>!!window.robotApp);await page.locator('#start-button').click();
  await check('level chooser exposes all50 levels across8 grade groups and selects group boundaries',async()=>{
    const collected=[];
    for(const group of LEVEL_GROUPS){
      await page.locator('#level-picker').click();await page.locator(`[data-grade="${group.grade}"]`).click();
      const ids=await page.locator('#level-grid [data-level]').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.level)));
      assert.deepEqual(ids,group.levelIds);collected.push(...ids);
      await page.locator(`#level-grid [data-level="${ids[0]}"]`).click();assert.equal((await snapshot()).state.levelId,ids[0]);
      await page.locator('#level-picker').click();await page.locator(`#level-grid [data-level="${ids.at(-1)}"]`).click();assert.equal((await snapshot()).state.levelId,ids.at(-1));
      assert.equal(await page.locator('#repeat-controls').isVisible(),ids.at(-1)>=31);
    }
    assert.equal(new Set(collected).size,50);return {groups:LEVEL_GROUPS.map(group=>group.grade),total:collected.length};
  });
  await check('lower-grade repeat blocks are rejected atomically through config',async()=>{
    await configure(1);const before=await snapshot();
    const result=await page.evaluate(()=>window.robotApp.applyConfig({...window.robotApp.getConfig(),queue:[{repeat:2,commands:['forward']}]}));
    assert.equal(result.valid,false);assert.deepEqual((await snapshot()).queue,before.queue);assert.equal(await page.locator('#repeat-controls').isVisible(),false);
  });
  await check('repeat composer add/save creates visible block and expanded step metadata',async()=>{
    await configure(31);await page.locator('#repeat-toggle').click();await page.locator('#repeat-count').selectOption('4');await page.locator('[data-command="right"]').click();await page.locator('#repeat-save').click();
    const s=await snapshot();assert.deepEqual(s.queue,[{repeat:4,commands:['right']}]);assert.equal(s.expandedLength,4);assert.equal(s.repeatDraft,null);
    assert.equal(await page.locator('#queue .repeat-block').count(),1);
    await page.screenshot({path:path.join(output,'level-31-repeat-composer.png'),fullPage:true});
    const during=await page.evaluate(()=>{window.robotApp.step();return {snapshot:window.robotApp.getSnapshot(),text:document.querySelector('#execution-detail').textContent};});
    assert.equal(during.snapshot.animating,true);assert.match(during.text,/ulangan 1\/4/);
    await settle();assert.equal((await snapshot()).cursor,1);
    await page.locator('#run-button').click();await settle();const final=await snapshot();assert.equal(final.cursor,4);assert.equal(final.state.dir,LEVELS.find(level=>level.id===31).start.dir);
    assert.equal(final.state.x,LEVELS.find(level=>level.id===31).start.x);assert.equal(final.state.y,LEVELS.find(level=>level.id===31).start.y);
  });
  await check('undo removes whole saved block; draft undo/cancel never changes saved program',async()=>{
    await page.locator('#undo-button').click();assert.equal((await snapshot()).queue.length,0);assert.equal((await snapshot()).cursor,0);
    await page.locator('#repeat-toggle').click();await page.locator('#repeat-count').selectOption('3');await page.locator('[data-command="forward"]').click();await page.locator('[data-command="right"]').click();await page.locator('#undo-button').click();
    assert.deepEqual((await snapshot()).repeatDraft.commands,['forward']);await page.locator('#repeat-cancel').click();assert.equal((await snapshot()).repeatDraft,null);assert.equal((await snapshot()).queue.length,0);
  });
  await check('composer caps body length at12 and refuses saving an empty body',async()=>{
    await page.locator('#repeat-toggle').click();assert.equal(await page.locator('#repeat-save').isDisabled(),true);
    await page.evaluate(()=>{const button=document.querySelector('[data-command="left"]');for(let i=0;i<15;i++)button.click();});
    assert.equal((await snapshot()).repeatDraft.commands.length,12);await page.locator('#repeat-save').click();assert.equal((await snapshot()).queue[0].commands.length,12);
    await page.locator('#undo-button').click();
  });
  await check('expanded cap256 accepts boundary and rejects overflow/nesting/invalid counts',async()=>{
    const block={repeat:4,commands:Array(12).fill('left')};
    const boundary=[...Array(5).fill(block),...Array(16).fill('left')];
    await configure(31,boundary);assert.equal((await snapshot()).expandedLength,MAX_EXPANDED_LENGTH);
    const bad=[ [...boundary,'left'], [{repeat:2,commands:[{repeat:2,commands:['left']}]}], [{repeat:5,commands:['left']}], [{repeat:2,commands:[]}], [{repeat:2,commands:Array(13).fill('left')}] ];
    for(const queue of bad){const result=await page.evaluate(queue=>window.robotApp.applyConfig({...window.robotApp.getConfig(),queue}),queue);assert.equal(result.valid,false);assert.equal((await snapshot()).expandedLength,256);}
    await configure(31);
  });
  await check('20 upper-grade levels also solve with primitive arrays (accelerated renderer integration)',async()=>{
    await page.evaluate(()=>{const scene=window.robotApp.scene;window.__qaLoopAnimate=scene.animate;scene.animate=function(...args){const promise=window.__qaLoopAnimate.apply(this,args);if(this.motion)this.motion.duration=12;return promise;};});
    for(const level of LEVELS.filter(level=>level.id>=31)){
      await configure(level.id,level.solution);await page.locator('#run-button').click();await settle();const s=await snapshot();assert.equal(s.state.won,true,`primitive route level${level.id}`);assert.equal(s.cursor,level.solution.length);
      upperPrimitive.push({levelId:level.id,commands:level.solution.length,passed:true});console.log('PASS primitive level'+level.id);
    }
    await page.evaluate(()=>{window.robotApp.scene.animate=window.__qaLoopAnimate;});return {levels:upperPrimitive.length,testAnimationMs:12};
  });
  await check('all layouts stay within viewport after navigating grade groups and scrolling program',async()=>{
    const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,scrollY}));
    assert.ok(metrics.scrollWidth<=metrics.width);assert.ok(metrics.scrollHeight<=metrics.height);assert.equal(metrics.scrollY,0);return metrics;
  });
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
}catch(error){fatal=error;await page.screenshot({path:path.join(output,'loop-controls-failure.png'),fullPage:true}).catch(()=>{});}
finally{await writeFile(path.join(output,'loop-controls-report.json'),JSON.stringify({testedAt:new Date().toISOString(),browser:await browser.version(),checks,upperPrimitive,externalRequests:external,browserErrors:errors,animationPolicy:'Composer step/run uses production timing.20 primitive upper-level replay cases accelerate only scene.motion.duration to12ms; not real-time animation evidence.'},null,2)+'\n');await browser.close();}
if(fatal){console.error(fatal);process.exitCode=1;}
