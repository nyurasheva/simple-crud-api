import request from 'supertest';
import { createAppServer } from '../app';
import { randomUUID } from 'crypto';

const app = createAppServer();

describe('User API - Negative Cases', () => {
  it('should return 400 for invalid POST data (POST /users)', async () => {
    const invalidUser = {
      username: '',
      age: -5,
    };

    const response = await request(app)
      .post('/api/users')
      .send(invalidUser)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid user data');
  });

  it('should return 400 for invalid userId (GET)', async () => {
    const response = await request(app)
      .get('/api/users/invalid-id')
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid userId');
  });

  it('should return 400 for invalid PUT data (PUT /users/:id)', async () => {
    const newUser = {
      username: 'MikeSmith',
      age: 28,
      hobbies: ['reading', 'sports'],
    };

    const createResponse = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');

    const userId = createResponse.body.id;

    const invalidUpdate = {
      age: -10,
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(invalidUpdate)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid user data');
  });

  it('should return 404 for deleting non-existent user (DELETE /users/:id)', async () => {
    const fakeId = randomUUID();

    const response = await request(app)
      .delete(`/api/users/${fakeId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
