import { spawn } from 'node:child_process';

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['allure', 'open', 'allure-report'];

const child = spawn(command, args, {
  detached: true,
  stdio: 'ignore',
  shell: false
});

child.unref();
