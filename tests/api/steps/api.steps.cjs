const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const Ajv = require('ajv');
const postListSchema = require('../schemas/post-list.schema.json');

const ajv = new Ajv();

Before(function () {
  this.context = {};
});

Given('a public API endpoint', function () {
  this.context.apiUrl = process.env.API_URL || 'https://jsonplaceholder.typicode.com';
});

When(/^I request GET \/posts$/, async function () {
  this.context.response = await fetch(`${this.context.apiUrl}/posts`);
  this.context.body = await this.context.response.json();
});

When(/^I request GET \/invalid-endpoint$/, async function () {
  this.context.response = await fetch(`${this.context.apiUrl}/invalid-endpoint`);
});

When('I create a new post with random dynamic data', async function () {
  this.context.payload = {
    userId: 1,
    title: `QA-${Date.now()}`,
    body: 'Post body for BDD'
  };
  this.context.response = await fetch(`${this.context.apiUrl}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(this.context.payload)
  });
  this.context.body = await this.context.response.json();
});

When('I update the created post', async function () {
  this.context.updatedPayload = {
    userId: this.context.payload.userId,
    title: `QA-updated-${Date.now()}`,
    body: 'Updated post body for BDD'
  };
  this.context.response = await fetch(`${this.context.apiUrl}/posts/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(this.context.updatedPayload)
  });
  this.context.body = await this.context.response.json();
});

When('I delete the created post', async function () {
  this.context.response = await fetch(`${this.context.apiUrl}/posts/1`, {
    method: 'DELETE'
  });
});

When('I create a new post with the same title', async function () {
  this.context.response = await fetch(`${this.context.apiUrl}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      title: 'foo',
      body: 'Duplicate title scenario'
    })
  });
  this.context.body = await this.context.response.json();
});

Then('the update response status code should be {int}', function (expectedStatus) {
  assert.strictEqual(this.context.response.status, expectedStatus);
});

Given(/^a post already exists with title "([^"]+)"$/, async function (title) {
  this.context.payload = {
    userId: 1,
    title,
    body: 'Existing post for duplicate scenario'
  };
  this.context.response = await fetch(`${this.context.apiUrl}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(this.context.payload)
  });
  this.context.body = await this.context.response.json();
});

Then('the response status code should be {int}', function (expectedStatus) {
  assert.strictEqual(this.context.response.status, expectedStatus);
});

Then('the response status code should be {int} or {int}', function (status1, status2) {
  assert.ok([status1, status2].includes(this.context.response.status));
});

Then('the response schema should match the post list contract', function () {
  const validate = ajv.compile(postListSchema);
  const valid = validate(this.context.body);
  assert.ok(valid, JSON.stringify(validate.errors, null, 2));
});

Then('the response body should include the created post data', function () {
  assert.ok(this.context.body.id);
});
