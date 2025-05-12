import request from 'supertest';
import { createAppServer } from '../app';
import { randomUUID } from 'crypto';

const app = createAppServer();

describe('User API', () => {
  it('should create a new user (POST /users)', async () => {
    const newUser = {
      username: 'JohnDoe',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(newUser.hobbies);
  });

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

  it('should get all users (GET /users)', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should get a user by ID (GET /users/:id)', async () => {
    const newUser = {
      username: 'JaneDoe',
      age: 25,
      hobbies: ['swimming', 'travelling'],
    };

    const createResponse = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');

    const userId = createResponse.body.id;

    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body.username).toBe(newUser.username);
  });

  it('should return 400 if userId is invalid (GET /users/:id)', async () => {
    const response = await request(app)
      .get('/api/users/invalid-id')
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid userId');
  });

  it('should update a user (PUT /users/:id)', async () => {
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

    const updatedUser = {
      username: 'MikeUpdated',
      age: 29,
      hobbies: ['reading', 'coding'],
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.age).toBe(updatedUser.age);
    expect(response.body.hobbies).toEqual(updatedUser.hobbies);
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

  it('should delete a user (DELETE /users/:id)', async () => {
    const newUser = {
      username: 'DeleteMe',
      age: 20,
      hobbies: ['sleeping', 'eating'],
    };

    const createResponse = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');

    const userId = createResponse.body.id;

    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(204);
  });

  it('should return 404 for deleting non-existent user (DELETE /users/:id)', async () => {
    const fakeId = randomUUID();

    const response = await request(app)
      .delete(`/api/users/${fakeId}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 404 if route is not found', async () => {
    const response = await request(app)
      .get('/api/nonexistent-route')
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
