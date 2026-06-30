import { exec } from 'node:child_process';

const command = process.platform === 'win32'
  ? 'npx.cmd allure open allure-report'
  : 'npx allure open allure-report';

exec(command, { shell: true }, (error) => {
  if (error) {
    console.error('Failed to open Allure report:', error.message);
    process.exit(1);
  }
});
