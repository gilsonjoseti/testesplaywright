import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const summaryPath = path.resolve('performance', 'k6-summary.json');
const outputDir = path.resolve('allure-results');

if (!fs.existsSync(summaryPath)) {
  console.error('k6 summary file not found:', summaryPath);
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const start = Date.now();
const testCaseId = `k6-performance-${randomUUID()}`;
const attachmentFile = `${testCaseId}-summary.json`;
const stop = start + 1000;
const failThreshold = summary?.metrics?.http_req_failed?.value >= 0.05;

const result = {
  uid: testCaseId,
  name: 'k6 performance test',
  fullName: 'performance/k6 API load test',
  status: failThreshold ? 'failed' : 'passed',
  statusDetails: {},
  stage: 'finished',
  steps: [],
  attachments: [
    {
      name: 'k6 summary',
      source: attachmentFile,
      type: 'application/json'
    }
  ],
  parameters: [
    { name: 'vus', value: String(summary.options?.vus ?? '10') },
    { name: 'duration', value: String(summary.options?.duration ?? '30s') },
    { name: 'baseUrl', value: String(summary.options?.vus ? summary.options.baseURL || summary.options.baseUrl || '' : '') }
  ],
  labels: [
    { name: 'language', value: 'JavaScript' },
    { name: 'framework', value: 'k6' },
    { name: 'package', value: 'performance' },
    { name: 'suite', value: 'k6 performance' }
  ],
  links: [],
  start,
  stop,
  description: 'Performance results exported from k6 and converted into Allure format.',
  testCaseId
};

const container = {
  uuid: randomUUID(),
  children: [testCaseId],
  befores: [],
  afters: [],
  name: 'k6 performance',
  start,
  stop
};

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, attachmentFile), JSON.stringify(summary, null, 2), 'utf8');
fs.writeFileSync(path.join(outputDir, `${testCaseId}-result.json`), JSON.stringify(result, null, 2), 'utf8');
fs.writeFileSync(path.join(outputDir, `${container.uuid}-container.json`), JSON.stringify(container, null, 2), 'utf8');
console.log('Created Allure result for k6 at', path.join(outputDir, `${testCaseId}-result.json`));
console.log('Created Allure container for k6 at', path.join(outputDir, `${container.uuid}-container.json`));
console.log('Attached k6 summary at', path.join(outputDir, attachmentFile));
