import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.API_URL || 'https://jsonplaceholder.typicode.com';

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<500']
  }
};

export default function () {
  const res = http.get(`${BASE_URL}/users?page=1`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time under 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
