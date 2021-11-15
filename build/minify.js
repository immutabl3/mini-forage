import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { promises as fs } from 'fs';

const brotli = promisify(zlib.brotliCompress);
const gzip = promisify(zlib.gzip);

const filepath = path.resolve(process.cwd(), 'dist/index.js');
const file = await fs.readFile(filepath);

const b = await brotli(file);
const brPath = path.resolve(process.cwd(), `dist/index.js.br`);
await fs.writeFile(brPath, b);

const gz = await gzip(file);
const gzPath = path.resolve(process.cwd(), `dist/index.js.gz`);
await fs.writeFile(gzPath, gz);
