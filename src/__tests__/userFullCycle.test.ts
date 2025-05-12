import request from 'supertest';
import { createAppServer } from '../app';

const app = createAppServer();

describe('User API - Create, Read, Update, Delete', () => {
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
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(newUser.hobbies);
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

    const getAfterDelete = await request(app)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json');

    expect(getAfterDelete.status).toBe(404);
    expect(getAfterDelete.body.message).toBe('User not found');
  });
});
