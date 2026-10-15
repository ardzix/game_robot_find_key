import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.ROBOT_PORT || 4186);
const HOST = '127.0.0.1';
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.mid': 'audio/midi', '.midi': 'audio/midi', '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
};
const send = (res, status, body) => {
  res.writeHead(status, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end(body);
};
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return send(res, 405, 'Metode tidak didukung.');
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://${HOST}:${PORT}`).pathname);
    if (pathname === '/_health') {
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      return res.end(req.method === 'HEAD' ? undefined : JSON.stringify({app: 'robot-cari-kunci', root: ROOT, port: PORT}));
    }
    if (pathname.includes('\0') || pathname.includes('\\')) return send(res, 400, 'Alamat tidak valid.');
    const requested = path.resolve(ROOT, `.${pathname === '/' ? '/index.html' : pathname}`);
    const relative = path.relative(ROOT, requested);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return send(res, 403, 'Di luar paket.');
    const actual = await realpath(requested);
    const actualRelative = path.relative(ROOT, actual);
    if (actualRelative.startsWith('..') || path.isAbsolute(actualRelative)) return send(res, 403, 'Di luar paket.');
    const info = await stat(actual);
    if (!info.isFile()) return send(res, 404, 'Berkas tidak ditemukan.');
    res.writeHead(200, {'Content-Type': mime[path.extname(actual).toLowerCase()] || 'application/octet-stream', 'Content-Length': info.size});
    if (req.method === 'HEAD') return res.end();
    createReadStream(actual).on('error', () => res.destroy()).pipe(res);
  } catch (error) {
    send(res, error instanceof URIError ? 400 : 404, 'Berkas tidak ditemukan atau alamat tidak valid.');
  }
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${PORT} sedang dipakai. Tutup server lama atau gunakan MULAI.cmd.`
    : `Server gagal: ${error.message}`);
  process.exitCode = 1;
});
server.listen(PORT, HOST, () => console.log(`Robot Cari Kunci: http://${HOST}:${PORT}\nPaket: ${ROOT}\nTekan Ctrl+C untuk berhenti.`));
