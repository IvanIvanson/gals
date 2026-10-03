// Временная сверка: базовый style.css против нового, по правилам (селектор -> объявления).
const fs = require('fs');
const os = require('os');
const path = require('path');

function parse(file) {
  const src = fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@charset[^;]*;/g, '')
    .replace(/@import url\([^)]*\)/g, '')
    .replace(/sourceMappingURL/g, '');

  const rules = new Map();
  const stack = [];
  const media = () => stack.filter((s) => s.startsWith('(max-width') || s.startsWith('(min-width')).join(' ');
  let buf = '';

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') {
      const head = buf.trim();
      buf = '';

      if (/^@(media|keyframes|-webkit-keyframes|supports)/.test(head)) {
        stack.push(head.replace(/^@(media|supports)\s*/, '').replace(/\s*\{$/, '').trim());
        continue;
      }

      // Съедаем тело правила целиком, вложенные блоки тоже.
      let body = '';
      let d = 1;
      let j = i + 1;
      for (; j < src.length && d > 0; j++) {
        if (src[j] === '{') d++;
        else if (src[j] === '}') d--;
        if (d > 0) body += src[j];
      }

      const decls = body
        .split(';')
        .map((x) => x.replace(/\s+/g, ' ').trim())
        .filter((x) => x && !/^-(webkit|moz|ms|o)-/.test(x))
        .sort();

      head.split(',').forEach((sel) => {
        const key = `${media()}||${sel.replace(/\s+/g, ' ').trim()}`;
        if (decls.length) rules.set(key, decls.join('; '));
      });

      i = j - 1;
      continue;
    }
    if (ch === '}') {
      if (stack.length) stack.pop();
      buf = '';
      continue;
    }
    buf += ch;
  }
  return rules;
}

const base = parse(path.join(os.tmpdir(), 'gals-scss-backup', 'style.baseline.css'));
const next = parse(process.env.OUT_NEW);

const removed = [];
const changed = [];
const added = [];

for (const [k, v] of base) if (!next.has(k)) removed.push([k, v]);
for (const [k, v] of next) if (!base.has(k)) added.push([k, v]);
for (const [k, v] of next) if (base.has(k) && base.get(k) !== v) changed.push([k, base.get(k), v]);

const show = (title, arr) => {
  console.log(`\n===== ${title}: ${arr.length} =====`);
  arr.forEach(([k, a, b]) => {
    const label = k.replace('||', '  |  ');
    if (b === undefined) console.log(`${label}\n    - ${a}`);
    else console.log(`${label}\n    - ${a}\n    + ${b}`);
  });
};

console.log('baseline rules:', base.size, ' new rules:', next.size);
show('REMOVED', removed);
show('CHANGED', changed);
show('ADDED', added);
