import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';
import {LEVELS} from '../levels.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),output=path.join(root,'test-results');
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH||'C:/Users/ardzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1366,height:768}}),checks=[];
await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
async function config(levelId,queue){const level=LEVELS.find(level=>level.id===levelId);const r=await page.evaluate(c=>window.robotApp.applyConfig(c),{version:1,levelId,queue:queue||level.programSolution||level.solution,playMode:'sequence',musicVolume:0,effectsVolume:0,muted:true});assert.equal(r.valid,true);}
let fatal;
try{
  await mkdir(output,{recursive:true});await page.goto('http://127.0.0.1:4186',{waitUntil:'networkidle'});await page.waitForFunction(()=>!!window.robotApp);await page.locator('#start-button').click();
  await config(50,Array(64).fill('left'));
  await page.evaluate(()=>{document.querySelector('#queue').scrollTop=1000;});
  assert.ok(await page.locator('#queue').evaluate(element=>element.scrollTop)>0,'test setup must actually scroll queue');
  await config(31);
  const top=await page.locator('#queue').evaluate(element=>({scrollTop:element.scrollTop,first:element.firstElementChild.getBoundingClientRect().top,viewport:element.getBoundingClientRect().top}));
  assert.equal(top.scrollTop,0);assert.ok(top.first>=top.viewport);
  checks.push({name:'changing configuration resets queue scroll and shows first repeat card completely',passed:true,detail:top});
  await page.screenshot({path:path.join(output,'level-31-normal-start.png'),fullPage:true});
  await config(50,Array(64).fill('left'));await page.evaluate(()=>{document.querySelector('#queue').scrollTop=1000;});
  await page.locator('#reset-button').click();assert.equal(await page.locator('#queue').evaluate(element=>element.scrollTop),0);checks.push({name:'reset level returns queue scroll to first instruction',passed:true});
  for(const levelId of [1,31,50])for(const size of [{width:1366,height:768},{width:1920,height:1080}]){
    await page.setViewportSize(size);await config(levelId);await page.waitForTimeout(150);
    const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,height:innerHeight,scrollY}));
    assert.equal(metrics.scrollWidth,size.width);assert.equal(metrics.scrollHeight,size.height);assert.equal(metrics.scrollY,0);
    checks.push({name:`level${levelId} fits ${size.width}x${size.height}`,passed:true,detail:metrics});
    await page.screenshot({path:path.join(output,`final-level-${String(levelId).padStart(2,'0')}-${size.width}x${size.height}.png`),fullPage:true});
    if(size.width===1366&&[31,50].includes(levelId))await page.screenshot({path:path.join(output,`level-${levelId}-normal-start.png`),fullPage:true});
  }
}catch(error){fatal=error;checks.push({name:'visual regression',passed:false,error:error.message});}
finally{await writeFile(path.join(output,'visual-report.json'),JSON.stringify({testedAt:new Date().toISOString(),browser:await browser.version(),checks,physicalTVTested:false},null,2)+'\n');await browser.close();}
if(fatal){console.error(fatal);process.exitCode=1;}else console.log(`PASS ${checks.length} visual checks`);
