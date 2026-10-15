import assert from 'node:assert/strict';
import http from 'node:http';
const base = 'http://127.0.0.1:4186';
const outcomes = [];
async function test(name, action) { await action(); outcomes.push({name, passed: true}); }
function request(target, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(base + target, {method}, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8')}));
    });
    req.on('error', reject);
    req.end();
  });
}
await test('loopback health', async () => { const r = await request('/_health'); assert.equal(r.status, 200); assert.equal(JSON.parse(r.body).app, 'robot-cari-kunci'); });
await test('cache disabled', async () => { const r = await request('/package.json'); assert.match(r.headers['cache-control'], /no-store/); assert.equal(r.headers['content-type'], 'application/json; charset=utf-8'); });
await test('HEAD has metadata and no body', async () => { const r = await request('/package.json', 'HEAD'); assert.equal(r.status, 200); assert.ok(Number(r.headers['content-length']) > 0); assert.equal(r.body, ''); });
await test('missing files fail clearly', async () => assert.equal((await request('/file-that-does-not-exist')).status, 404));
await test('write methods rejected', async () => assert.equal((await request('/package.json', 'POST')).status, 405));
await test('encoded traversal rejected', async () => assert.equal((await request('/%2e%2e%2fPasted%20text.txt')).status, 403));
await test('backslash traversal rejected', async () => assert.equal((await request('/%2e%2e%5csecret.txt')).status, 400));
await test('malformed percent URL rejected', async () => assert.equal((await request('/%zz')).status, 400));
console.log(JSON.stringify({ok: true, outcomes}, null, 2));
