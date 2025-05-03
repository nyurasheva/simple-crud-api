import { IncomingMessage, ServerResponse } from 'http';
import { validate as isUUID } from 'uuid';
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserByIdService,
} from './service';
import { User } from './types';

// Тип для парсинга тела запроса
type ParsedBody = Partial<Omit<User, 'id'>> & Record<string, unknown>;

// Хелпер для чтения JSON-тела
async function parseBody(req: IncomingMessage): Promise<ParsedBody> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}') as ParsedBody;
        resolve(parsed);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

// Хелпер для извлечения ID из URL
function extractId(url: string | undefined): string | undefined {
  const match = url?.match(/^\/users\/([0-9a-fA-F-]{36})$/);
  return match ? match[1] : undefined;
}

export async function userRouter(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;
  res.setHeader('Content-Type', 'application/json');

  // GET /users
  if (method === 'GET' && url === '/users') {
    res.writeHead(200);
    return res.end(JSON.stringify(getAllUsersService()));
  }

  // POST /users
  if (method === 'POST' && url === '/users') {
    try {
      const data = await parseBody(req);
      const userData = {
        username: data.username as string,
        age: data.age as number,
        hobbies: data.hobbies as string[],
      };
      const user = createUserService(userData);
      res.writeHead(201);
      return res.end(JSON.stringify(user));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.writeHead(400);
      return res.end(JSON.stringify({ message: msg }));
    }
  }

  // Всё, что дальше — /users/:id
  const id = extractId(url);
  if (!id) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: 'Route not found' }));
  }
  if (!isUUID(id)) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: 'Invalid userId' }));
  }

  // GET /users/:id
  if (method === 'GET') {
    const user = getUserByIdService(id);
    if (!user) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: 'User not found' }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify(user));
  }

  // PUT /users/:id
  if (method === 'PUT') {
    try {
      const data = await parseBody(req);
      const userData = {
        username: data.username as string,
        age: data.age as number,
        hobbies: data.hobbies as string[],
      };
      const updated = updateUserService(id, userData);
      if (!updated) {
        res.writeHead(404);
        return res.end(JSON.stringify({ message: 'User not found' }));
      }
      res.writeHead(200);
      return res.end(JSON.stringify(updated));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.writeHead(400);
      return res.end(JSON.stringify({ message: msg }));
    }
  }

  // DELETE /users/:id
  if (method === 'DELETE') {
    const deleted = deleteUserByIdService(id);
    if (!deleted) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: 'User not found' }));
    }
    res.writeHead(204);
    return res.end();
  }

  // Иначе — 404
  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Route not found' }));
}
