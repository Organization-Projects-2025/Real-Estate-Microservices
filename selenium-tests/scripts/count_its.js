const fs = require('fs');
const path = require('path');

function countInFile(file) {
  const s = fs.readFileSync(file, 'utf8');
  const m = s.match(/^\s*it\(/gm);
  return m ? m.length : 0;
}

const dir = path.join(__dirname, '..', 'tests', 'real-estate');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js'));
files.forEach(f => {
  const full = path.join(dir, f);
  console.log(`${f}: ${countInFile(full)}`);
});

function allJsFiles(p) {
  let res = [];
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, e.name);
    if (e.isDirectory()) res = res.concat(allJsFiles(full));
    else if (e.isFile() && full.endsWith('.js')) res.push(full);
  }
  return res;
}

const all = allJsFiles(path.join(__dirname, '..', 'tests'));
let total = 0;
all.forEach(f => { total += countInFile(f); });
console.log('TOTAL: ' + total);
