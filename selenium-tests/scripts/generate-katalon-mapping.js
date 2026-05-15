const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..', 'Katalon', 'Test Cases');
const out = path.join(__dirname, '..', 'katalon-mapping.csv');

const mapping = {
  Authentication: 'authentication.test.js',
  PropertyService: 'propertyservice.test.js',
  Agent: 'agent.test.js',
  Profile: 'profile.test.js',
  Admin: 'admin.test.js',
  Review: 'reviews.test.js',
  Notification: 'notifications.test.js',
  DeveloperProperties: 'developer-properties.test.js',
  Navigation: 'navigation.test.js',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.tc')) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(root);

const rows = [];
rows.push('katalon_path,selenium_file,status,notes');

for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const parts = rel.split('/');
  const top = parts[0];
  const selenium = mapping[top] || 'core.test.js';
  rows.push(`"${rel}","${selenium}",pending,""`);
}

// Correct CSV output (fixing any accidental unterminated lines)
const fixed = rows.map((r) => r.replace(/\r?\n/g, ' '));
fs.writeFileSync(out, fixed.join('\n'));
console.log('Wrote', out, 'with', files.length, 'entries');
