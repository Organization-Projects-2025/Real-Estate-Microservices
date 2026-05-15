const { spawn } = require('child_process');
const args = ['--timeout', '300000', 'tests/real-estate/**/*.test.js'];

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const proc = spawn(cmd, ['mocha', ...args], { stdio: 'inherit', shell: false });

proc.on('close', (code) => {
  process.exit(code);
});
