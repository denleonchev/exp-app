import { config } from 'dotenv';
import request from 'supertest';

import { App } from '../src/app';
import { main } from '../src/main';

let app: App;

beforeAll(async () => {
  config({ path: './e2e.env' });
  app = await main();
});

afterAll(async () => {
  app.server?.close();
});

describe('POST /users/register', () => {
  it('returns 422 when payload is invalid', async () => {
    const response = await request(app.server!)
      .post('/users/register')
      .send({ email: 't@a.ua', password: '1' });

    expect(response.status).toBe(422);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('property', 'name');
  });

  it('successfully registers a new user', async () => {
    const uniqueEmail = `user_${Date.now()}@test.com`;
    const payload = {
      email: uniqueEmail,
      password: 'strongpassword',
      name: 'Test User',
    };

    const res = await request(app.server!)
      .post('/users/register')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(uniqueEmail);
    expect(res.body.name).toBe(payload.name);
  });

  it('returns 422 when user already exists', async () => {
    const duplicateEmail = `dup_${Date.now()}@test.com`;
    const payload = {
      email: duplicateEmail,
      password: 'strongpassword',
      name: 'Dup User',
    };

    const firstResponse = await request(app.server!)
      .post('/users/register')
      .send(payload);
    expect(firstResponse.status).toBe(200);

    const secondResponse = await request(app.server!)
      .post('/users/register')
      .send(payload);

    expect(secondResponse.status).toBe(422);
    expect(secondResponse.body).toHaveProperty('err', 'User exists');
  });
});
