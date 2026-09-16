/*  Static file server for the browser apps in this repository.
 *
 *    node scripts/serve.js                serve the repository root on 8172
 *    node scripts/serve.js 8080           the repository root on another port
 *    node scripts/serve.js GALAXIES       one folder as the site root
 *    node scripts/serve.js GALAXIES 8080  both
 *
 *  Serving the repository root is what makes the apps page at index.html work,
 *  since its links point into the project folders. Nothing is cached, so a
 *  reload always shows the file as it is on disk.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dirArg = args.find((a) => !/^\d+$/.test(a));
const portArg = args.find((a) => /^\d+$/.test(a));
const root = path.resolve(dirArg ? path.resolve(process.cwd(), dirArg) : path.join(__dirname, '..'));
const port = Number(portArg || 8172);

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Not a folder: ${root}`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf'
};

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent((req.url || '/').split('?')[0]); }
  catch (e) { send(res, 400, 'Bad request'); return; }

  let file = path.resolve(root, '.' + path.posix.normalize(urlPath));
  if (file !== root && !file.startsWith(root + path.sep)) { send(res, 403, 'Forbidden'); return; }

  fs.stat(file, (err, st) => {
    const target = (!err && st.isDirectory()) ? path.join(file, 'index.html') : file;
    fs.readFile(target, (e, buf) => {
      if (e) { send(res, 404, `Not found: ${urlPath}`); return; }
      send(res, 200, buf, TYPES[path.extname(target).toLowerCase()] || 'application/octet-stream');
    });
  });
}).listen(port, () => {
  console.log(`Serving ${root}`);
  console.log(`  http://localhost:${port}/`);
});
