/**
 * Собирает download/grid.zip и его SHA-256.
 *
 * ZIP пишется вручную, без зависимостей: в архиве четыре небольших файла,
 * поэтому deflate из node:zlib и CRC32 достаточно. Время фиксировано, чтобы
 * `npm run build` не менял бинарник при каждом запуске и CI мог проверять
 * `git diff --exit-code`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));

const FILES = [
  ['README.txt', `${ROOT}/download/info.txt`],
  ['LICENSE', `${REPO}/LICENSE`],
  ['gals/gals.css', `${ROOT}/gals/gals.css`],
  ['gals/gals.js', `${ROOT}/gals/gals.js`],
];

const DOS_TIME = 0; // 00:00:00
const DOS_DATE = ((2026 - 1980) << 9) | (11 << 5) | 7; // 2026-11-07

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const localParts = [];
const centralParts = [];
let offset = 0;

for (const [name, path] of FILES) {
  const nameBuffer = Buffer.from(name, 'utf8');
  const source = readFileSync(path);
  const compressed = deflateRawSync(source, { level: 9 });
  const crc = crc32(source);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 names
  local.writeUInt16LE(8, 8); // deflate
  local.writeUInt16LE(DOS_TIME, 10);
  local.writeUInt16LE(DOS_DATE, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(source.length, 22);
  local.writeUInt16LE(nameBuffer.length, 26);
  local.writeUInt16LE(0, 28);

  localParts.push(local, nameBuffer, compressed);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(8, 10);
  central.writeUInt16LE(DOS_TIME, 12);
  central.writeUInt16LE(DOS_DATE, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(compressed.length, 20);
  central.writeUInt32LE(source.length, 24);
  central.writeUInt16LE(nameBuffer.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(offset, 42);

  centralParts.push(central, nameBuffer);
  offset += local.length + nameBuffer.length + compressed.length;
}

const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(FILES.length, 8);
end.writeUInt16LE(FILES.length, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);

const zip = Buffer.concat([...localParts, ...centralParts, end]);
const target = `${ROOT}/download/grid.zip`;

writeFileSync(target, zip);
writeFileSync(
  `${target}.sha256`,
  `${createHash('sha256').update(zip).digest('hex')}  grid.zip\n`,
  'utf8',
);

console.log(`download/grid.zip: ${zip.length} bytes, ${FILES.length} entries`);
