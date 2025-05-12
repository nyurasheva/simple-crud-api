import request from 'supertest';
import { createAppServer } from '../app';

const app = createAppServer();

describe('User API - Listing and Route Errors', () => {
  it('should get all users (GET /users)', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should return 404 if route is not found', async () => {
    const response = await request(app)
      .get('/api/nonexistent-route')
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
