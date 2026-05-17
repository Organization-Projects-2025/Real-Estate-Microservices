const fs = require('fs');
const path = require('path');

function countInFile(file) {
  const s = fs.readFileSync(file, 'utf8');
  const m = s.match(/^\s*it\(/gm);
  return m ? m.length : 0;
}

function allJsFiles(p) {
  let res = [];
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, e.name);
    if (e.isDirectory()) res = res.concat(allJsFiles(full));
    else if (e.isFile() && full.endsWith('.js')) res.push(full);
  }
  return res;
}

const root = path.join(__dirname, '..', '..');
const files = allJsFiles(root);
let total = 0;
files.forEach(f => {
  const c = countInFile(f);
  if (c>0) console.log(`${path.relative(root,f)}: ${c}`);
  total+=c;
});
console.log('WORKSPACE TOTAL: '+total);
