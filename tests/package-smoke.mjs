import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),output=path.join(root,'test-results');
await mkdir(output,{recursive:true});
const base=process.env.ROBOT_SMOKE_URL||'http://127.0.0.1:4186';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Smoke server must be loopback.');
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH||'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1366,height:768},serviceWorkers:'block'}),external=[],errors=[],checks=[];
await context.route('**/*',route=>{const u=new URL(route.request().url());if(['127.0.0.1','localhost'].includes(u.hostname))return route.continue();external.push(u.href);return route.abort('internetdisconnected');});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));let health,fatal;
try{
  health=await(await context.request.get(base+'/_health')).json();assert.equal(health.app,'robot-cari-kunci');
  if(process.env.ROBOT_EXPECT_ROOT)assert.equal(path.normalize(health.root).toLowerCase(),path.normalize(process.env.ROBOT_EXPECT_ROOT).toLowerCase());
  checks.push({name:'server identifies expected extracted package root',passed:true,root:health.root});
  for(const pass of ['cold-start','fresh-reload']){
    const response=await page.goto(base,{waitUntil:'networkidle'});assert.match(response.headers()['cache-control'],/no-store/);
    await page.waitForFunction(()=>!!window.robotApp);assert.equal(await page.evaluate(()=>window.robotApp.audio.getStatus().contextState),'not-created');
    await page.locator('#start-button').click();assert.equal(await page.evaluate(()=>window.robotApp.audio.getStatus().contextState),'running');
    const levels=await page.evaluate(async()=>{const {LEVELS}=await import('/levels.js');return LEVELS;});assert.equal(levels.length,50);
    for(const id of pass==='cold-start'?[1,31,50]:[1]){
      const level=levels.find(l=>l.id===id);
      const result=await page.evaluate(c=>window.robotApp.applyConfig(c),{version:1,levelId:id,queue:level.programSolution,playMode:'sequence',musicVolume:0,effectsVolume:0,muted:true});assert.equal(result.valid,true);
      if(id===50)await page.screenshot({path:path.join(output,'extracted-package-level-50.png'),fullPage:true});
      if(id!==1)await page.evaluate(()=>{const scene=window.robotApp.scene;if(!scene.__smokeOriginal){scene.__smokeOriginal=scene.animate;scene.animate=function(...args){const result=this.__smokeOriginal.apply(this,args);if(this.motion)this.motion.duration=12;return result;};}});
      await page.locator('#run-button').click();await page.waitForFunction(()=>{const s=window.robotApp.getSnapshot();return !s.running&&!s.animating;},null,{timeout:60000});
      assert.equal(await page.evaluate(()=>window.robotApp.getSnapshot().state.won),true);checks.push({name:`${pass} level${id} solved from extracted files`,passed:true,animation:id===1?'normal':'12ms test acceleration'});
    }
  }
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
}catch(error){fatal=error;checks.push({name:'package smoke',passed:false,error:error.message});}
finally{await mkdir(output,{recursive:true});await writeFile(path.join(output,'package-smoke-report.json'),JSON.stringify({testedAt:new Date().toISOString(),base,health,browser:await browser.version(),checks,externalRequests:external,browserErrors:errors,physicalNetworkDisconnected:false},null,2)+'\n');await browser.close();}
if(fatal){console.error(fatal);process.exitCode=1;}else console.log(`PASS ${checks.length} extracted-package smoke checks`);
