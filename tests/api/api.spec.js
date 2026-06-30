import { test, expect } from '@playwright/test';
import userData from './fixtures/user-data.json' assert { type: 'json' };

const apiUrl = process.env.API_URL || 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API tests', () => {
  test('GET /posts returns 200 and valid schema', async ({ request }) => {
    const response = await request.get(`${apiUrl}/posts`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body[0]).toHaveProperty('userId');
    expect(body[0]).toHaveProperty('title');
    expect(body[0]).toHaveProperty('body');
  });

  test('GET /invalid-endpoint returns 404', async ({ request }) => {
    const response = await request.get(`${apiUrl}/invalid-endpoint`);
    expect(response.status()).toBe(404);
  });

  test('Create post and update/delete existing resource flow adapted for JSONPlaceholder', async ({ request }) => {
    const payload = {
      ...userData.defaultPost,
      title: `QA-${Date.now()}`
    };

    const createResponse = await request.post(`${apiUrl}/posts`, { json: payload });
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    expect(created).toHaveProperty('id');
    expect(created.id).toBeGreaterThan(0);

    const updatedPayload = {
      userId: payload.userId,
      title: `QA-updated-${Date.now()}`,
      body: 'Updated body for QA post'
    };
    const updateResponse = await request.put(`${apiUrl}/posts/1`, { json: updatedPayload });
    expect(updateResponse.status()).toBe(200);
    const updated = await updateResponse.json();
    expect(updated).toHaveProperty('id');
    expect(updated.id).toBe(1);

    const deleteResponse = await request.delete(`${apiUrl}/posts/1`);
    expect(deleteResponse.status()).toBe(200);
  });

  test('Creating a duplicate post returns 201 or 400', async ({ request }) => {
    const response = await request.post(`${apiUrl}/posts`, { json: userData.defaultPost });
    expect([201, 400]).toContain(response.status());
  });
});
