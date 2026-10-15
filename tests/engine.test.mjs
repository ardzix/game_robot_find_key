import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LEVELS, LEVEL_GROUPS, COMMANDS, DIRECTIONS } from '../levels.js';
import { createState, applyCommand, validateConfig, configToState, expandQueue, DEFAULT_CONFIG, MAX_QUEUE_LENGTH, MAX_EXPANDED_LENGTH } from '../engine.js';

// Plain Node runner: compatible with the locally bundled Node 16 runtime.
const cases = [];
const test = (name, fn) => cases.push({ name, fn });

const run = (state, commands) => commands.reduce((current, command) => applyCommand(current, command).state, state);
const config = patch => ({ ...DEFAULT_CONFIG, initialState: { ...DEFAULT_CONFIG.initialState }, queue: [], ...patch });

// Independent BFS uses its own transitions; it never calls the production applyCommand.
function shortestDistance(level) {
  const directions = [[0,-1],[1,0],[0,1],[-1,0]],walls=new Set(level.obstacles.map(p=>`${p.x}:${p.y}`));
  const seen=new Set(),todo=[[level.start.x,level.start.y,DIRECTIONS.indexOf(level.start.dir),false,0]];
  for(let i=0;i<todo.length;i++){
    const [x,y,d,key,count]=todo[i],signature=`${x}:${y}:${d}:${key}`;
    if(seen.has(signature))continue;seen.add(signature);
    if(key&&x===level.chest.x&&y===level.chest.y)return count+1;
    todo.push([x,y,(d+1)%4,key,count+1],[x,y,(d+3)%4,key,count+1]);
    if(!key&&x===level.key.x&&y===level.key.y)todo.push([x,y,d,true,count+1]);
    const nx=x+directions[d][0],ny=y+directions[d][1];
    if(nx>=0&&ny>=0&&nx<level.width&&ny<level.height&&!walls.has(`${nx}:${ny}`))todo.push([nx,ny,d,key,count+1]);
  }
  return Infinity;
}

for (const level of LEVELS) {
  test(`Level ${level.id} ${level.grade}: map, independent shortest route, and program verified`, () => {
    const inside = point => Number.isInteger(point.x) && Number.isInteger(point.y) && point.x >= 0 && point.y >= 0 && point.x < level.width && point.y < level.height;
    assert.ok([level.start, level.key, level.chest, ...level.obstacles].every(inside));
    for (const point of [level.start, level.key, level.chest]) assert.ok(!level.obstacles.some(block => block.x === point.x && block.y === point.y));
    assert.ok(level.solution.length <= MAX_QUEUE_LENGTH);
    assert.equal(shortestDistance(level),level.shortestCommandCount);
    assert.equal(level.solution.length,level.shortestCommandCount);
    assert.ok(level.width<=8&&level.height<=8);
    assert.deepEqual(expandQueue(level.programSolution).map(v=>v.command),level.solution);
    const candidate=config({levelId:level.id,queue:level.programSolution});delete candidate.initialState;
    assert.equal(validateConfig(candidate).valid,true);
    assert.equal(level.loopAvailable,level.id>=31);
    if(level.id>=31)assert.ok(level.programSolution.some(item=>typeof item==='object'));
    let state = createState(level.id);
    for (const command of level.solution) {
      const result = applyCommand(state, command);
      assert.ok(['move', 'turn', 'key', 'success'].includes(result.event), `${command}: ${result.event}`);
      state = result.state;
    }
    assert.equal(state.won, true);
    assert.equal(state.hasKey, true);
    assert.deepEqual({ x: state.x, y: state.y }, level.chest);
  });
}

test('Forward follows robot orientation in all four directions; turns stay in place', () => {
  const expected = { N: [1, 0], E: [2, 1], S: [1, 2], W: [0, 1] };
  for (const dir of DIRECTIONS) {
    const state = { ...createState(2), x: 1, y: 1, dir };
    const moved = applyCommand(state, 'forward');
    assert.equal(moved.event, 'move');
    assert.deepEqual([moved.state.x, moved.state.y], expected[dir]);
    for (const turn of ['left', 'right']) {
      const turned = applyCommand(state, turn);
      assert.equal(turned.event, 'turn');
      assert.deepEqual([turned.state.x, turned.state.y], [1, 1]);
      assert.equal(run(state, [turn, turn, turn, turn]).dir, dir);
    }
    assert.equal(applyCommand(state, 'right').state.dir, DIRECTIONS[(DIRECTIONS.indexOf(dir) + 1) % 4]);
    assert.equal(applyCommand(state, 'left').state.dir, DIRECTIONS[(DIRECTIONS.indexOf(dir) + 3) % 4]);
    assert.deepEqual(run(state, ['left', 'right']), state);
  }
});

test('Key requires explicit take on the same cell', () => {
  const adjacent = run(createState(7), ['forward']);
  assert.equal(applyCommand(adjacent, 'take').event, 'missing');
  const onKey = applyCommand(adjacent, 'forward').state;
  assert.equal(onKey.hasKey, false);
  const taken = applyCommand(onKey, 'take');
  assert.equal(taken.event, 'key');
  assert.equal(taken.state.hasKey, true);
  assert.equal(applyCommand(taken.state, 'take').event, 'already');
});

test('Chest requires same cell and key; failed open is recoverable', () => {
  const onChest = run(createState(7), ['forward', 'forward', 'left', 'forward', 'forward']);
  const locked = applyCommand(onChest, 'open');
  assert.equal(locked.event, 'locked');
  assert.deepEqual(locked.state, onChest);
  const recovered = run(locked.state, ['right', 'right', 'forward', 'forward', 'take', 'right', 'right', 'forward', 'forward', 'open']);
  assert.equal(recovered.won, true);
  const adjacentWithKey = { ...onChest, y: onChest.y + 1, hasKey: true };
  assert.equal(applyCommand(adjacentWithKey, 'open').event, 'missing');
});

test('Walls and every obstacle block motion without a penalty', () => {
  for (const dir of ['W', 'S']) {
    const start = { ...createState(12), dir };
    const result = applyCommand(start, 'forward');
    assert.equal(result.event, 'blocked');
    assert.deepEqual(result.state, start);
  }
  for (const block of LEVELS[11].obstacles) {
    const nextToBlock = { ...createState(12), x: block.x - 1, y: block.y };
    const result = applyCommand(nextToBlock, 'forward');
    assert.equal(result.event, 'blocked');
    assert.deepEqual(result.state, nextToBlock);
  }
  const start = createState(12);
  assert.equal(run(start, LEVELS[11].solution).won, true);
});

test('Input state, level definitions, and queues are never mutated', () => {
  for (const command of COMMANDS) {
    const state = Object.freeze(createState(1));
    const before = JSON.stringify(state);
    const result = applyCommand(state, command);
    assert.notEqual(result.state, state);
    assert.equal(JSON.stringify(state), before);
  }
  assert.ok(Object.isFrozen(LEVELS));
  assert.ok(Object.isFrozen(LEVELS[2].obstacles));
  const input = config({ queue: ['take'] });
  const normalized = validateConfig(input).config;
  normalized.queue.push('forward');
  assert.deepEqual(input.queue, ['take']);
});

test('Repeated pure commands stay legal; post-success commands do nothing', () => {
  let state = createState(50);
  const cycle = ['forward', 'forward', 'take', 'open', 'right'];
  for (let i = 0; i < 5000; i++) {
    state = applyCommand(state, cycle[i % cycle.length]).state;
    const level = LEVELS[state.levelId - 1];
    assert.ok(state.x >= 0 && state.x < level.width && state.y >= 0 && state.y < level.height);
    assert.ok(!level.obstacles.some(block => block.x === state.x && block.y === state.y));
  }
  const won = run(createState(1), LEVELS[0].solution);
  for (const command of COMMANDS) {
    const result = applyCommand(won, command);
    assert.equal(result.event, 'already');
    assert.deepEqual(result.state, won);
  }
});

test('Defaults on disk match runtime defaults and represent a fresh proposed start', async () => {
  const disk = JSON.parse(await readFile(new URL('../config/DEFAULT_CONFIG.json', import.meta.url), 'utf8'));
  assert.deepEqual(disk, DEFAULT_CONFIG);
  assert.equal(validateConfig(disk).valid, true);
  assert.deepEqual(configToState(disk), createState(1));
  assert.deepEqual(disk.queue, []);
});

test('All 50 levels, modes, volume endpoints and 64-card queue validate', () => {
  for (const levelId of LEVELS.map(level=>level.id)) {
    for (const playMode of ['sequence', 'step']) {
      const input = config({ levelId, playMode, queue: Array(64).fill('forward'), musicVolume: 0, effectsVolume: 1, muted: true });
      delete input.initialState;
      const result = validateConfig(input);
      assert.equal(result.valid, true, result.errors.join(' '));
      assert.deepEqual(configToState(result.config), createState(levelId));
      assert.deepEqual(result.config.initialState, { ...LEVELS[levelId - 1].start, hasKey: false, won: false });
    }
  }
});

test('Invalid config values, unknown capabilities and forged start states are rejected', () => {
  const bad = [null, [], 3, '', config({ version: 2 }), config({ levelId: '1' }), config({ levelId: 51 }), config({ queue: 'forward' }), config({ queue: Array(65).fill('forward') }), config({ queue: ['jump'] }), config({ queue: [null] }), config({ queue: Array(1) }), config({ playMode: 'auto' }), config({ musicVolume: -0.01 }), config({ musicVolume: NaN }), config({ effectsVolume: Infinity }), config({ effectsVolume: 1.01 }), config({ effectsVolume: '0.5' }), config({ muted: 1 }), config({ map: [] }), config({ initialState: null }), config({ initialState: { ...DEFAULT_CONFIG.initialState, hasKey: true } }), config({ initialState: { ...DEFAULT_CONFIG.initialState, x: 1 } }), config({ levelId: 5 }), config({ initialState: { ...DEFAULT_CONFIG.initialState, bonus: 0 } })];
  const missing = config();
  delete missing.queue;
  bad.push(missing);
  for (const input of bad) {
    const result = validateConfig(input);
    assert.equal(result.valid, false, JSON.stringify(input));
    assert.ok(result.errors.length > 0);
    assert.throws(() => configToState(input), TypeError);
  }
});

test('Invalid direct command and level fail explicitly; reset returns fresh start', () => {
  assert.throws(() => createState(51), RangeError);
  assert.throws(() => applyCommand(createState(1), 'jump'), RangeError);
  run(createState(1), LEVELS[0].solution);
  assert.deepEqual(createState(1), { levelId: 1, x: 0, y: 2, dir: 'E', hasKey: false, won: false });
});

test('50 distinct maps are assigned to the requested eight progressive groups',()=>{
  assert.deepEqual(LEVEL_GROUPS.map(g=>g.count),[6,6,6,6,6,6,7,7]);
  assert.deepEqual(LEVELS.map(l=>l.id),Array.from({length:50},(_,i)=>i+1));
  const fingerprints=LEVELS.map(({width,height,start,key,chest,obstacles})=>JSON.stringify({width,height,start,key,chest,obstacles}));
  assert.equal(new Set(fingerprints).size,50);
});

test('Loop expansion preserves provenance, order, and independent copies',()=>{
  const block={repeat:2,commands:['forward','right']},queue=['take',block,'open'];
  assert.deepEqual(expandQueue(queue),[
    {command:'take',sourceIndex:0,iteration:1,repeatCount:1,bodyIndex:0},
    {command:'forward',sourceIndex:1,iteration:1,repeatCount:2,bodyIndex:0},
    {command:'right',sourceIndex:1,iteration:1,repeatCount:2,bodyIndex:1},
    {command:'forward',sourceIndex:1,iteration:2,repeatCount:2,bodyIndex:0},
    {command:'right',sourceIndex:1,iteration:2,repeatCount:2,bodyIndex:1},
    {command:'open',sourceIndex:2,iteration:1,repeatCount:1,bodyIndex:0}
  ]);
  const candidate=config({levelId:31,queue});delete candidate.initialState;
  const normalized=validateConfig(candidate).config;normalized.queue[1].commands.push('left');
  assert.deepEqual(block.commands,['forward','right']);
});

test('Loop is unavailable before SD 4; repeat2–4 is supported on every upper level',()=>{
  for(const level of LEVELS)for(const repeat of [2,3,4]){
    const candidate=config({levelId:level.id,queue:[{repeat,commands:['forward']}]});delete candidate.initialState;
    assert.equal(validateConfig(candidate).valid,level.id>=31);
  }
});

test('Loop shape, nesting, finite limits, holes and excess fields are rejected',()=>{
  const invalid=[null,{},Array(65).fill('forward'),[{}],[[]],[null],[{repeat:1,commands:['forward']}],[{repeat:5,commands:['forward']}],[{repeat:2.5,commands:['forward']}],[{repeat:'2',commands:['forward']}],[{repeat:2,commands:[]}],[{repeat:2,commands:Array(13).fill('forward')}],[{repeat:2,commands:['jump']}],[{repeat:2,commands:Array(1)}],[{repeat:2,commands:[{repeat:2,commands:['forward']}]}],[{repeat:2,commands:['forward'],extra:true}],Array.from({length:6},()=>({repeat:4,commands:Array(12).fill('forward')}))];
  for(const queue of invalid){assert.throws(()=>expandQueue(queue));const candidate=config({levelId:31,queue});delete candidate.initialState;assert.equal(validateConfig(candidate).valid,false);}
});

test('Exactly 256 expanded commands are accepted; 257 is rejected without mutation',()=>{
  const queue=Array.from({length:5},()=>({repeat:4,commands:Array(12).fill('forward')}));
  queue.push({repeat:4,commands:Array(4).fill('forward')});
  const before=JSON.stringify(queue);assert.equal(expandQueue(queue).length,MAX_EXPANDED_LENGTH);assert.equal(JSON.stringify(queue),before);
  queue.push('left');assert.throws(()=>expandQueue(queue),RangeError);
});

let failures = 0;
for (const { name, fn } of cases) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${name}\n${error.stack}`);
  }
}
console.log(`${cases.length - failures}/${cases.length} passed; ${failures} failed.`);
process.exitCode = failures ? 1 : 0;
