import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { User, CreateUserData } from './types';
import { MemoryRepository } from './repository';

const userRepository = new MemoryRepository<User>();

function isValidUserData(data: unknown): data is CreateUserData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as CreateUserData).username === 'string' &&
    typeof (data as CreateUserData).age === 'number' &&
    Array.isArray((data as CreateUserData).hobbies) &&
    (data as CreateUserData).hobbies.every((h) => typeof h === 'string')
  );
}

function extractValidUUID(url: string | undefined): string | null {
  const match = url?.match(/^\/users\/([0-9a-fA-F-]{36})$/);
  const id = match ? match[1] : null;
  return id && isUUID(id) ? id : null;
}

export async function userRouter(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url === '/users') {
    const users = userRepository.findAll();
    res.writeHead(200);
    return res.end(JSON.stringify(users));
  }

  if (method === 'POST' && url === '/users') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      let data: unknown;
      try {
        data = JSON.parse(body);
      } catch {
        res.writeHead(400);
        return res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }

      if (!isValidUserData(data)) {
        res.writeHead(400);
        return res.end(JSON.stringify({ message: 'Invalid user data' }));
      }

      const newUser: User = { id: uuidv4(), ...data };
      userRepository.create(newUser);

      res.writeHead(201);
      return res.end(JSON.stringify(newUser));
    });
    return;
  }

  if (url?.startsWith('/users/')) {
    const id = extractValidUUID(url);
    if (!id) {
      res.writeHead(400);
      return res.end(JSON.stringify({ message: 'Invalid userId' }));
    }

    if (method === 'GET') {
      const user = userRepository.findById(id);
      if (!user) {
        res.writeHead(404);
        return res.end(JSON.stringify({ message: 'User not found' }));
      }
      res.writeHead(200);
      return res.end(JSON.stringify(user));
    }

    if (method === 'PUT') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        let data: unknown;
        try {
          data = JSON.parse(body);
        } catch {
          res.writeHead(400);
          return res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }

        if (!isValidUserData(data)) {
          res.writeHead(400);
          return res.end(JSON.stringify({ message: 'Invalid user data' }));
        }

        const updatedUser: User = { id, ...data };
        const success = userRepository.update(id, data);
        if (!success) {
          res.writeHead(404);
          return res.end(JSON.stringify({ message: 'User not found' }));
        }

        res.writeHead(200);
        return res.end(JSON.stringify(updatedUser));
      });
      return;
    }

    if (method === 'DELETE') {
      const deleted = userRepository.delete(id);
      if (!deleted) {
        res.writeHead(404);
        return res.end(JSON.stringify({ message: 'User not found' }));
      }
      res.writeHead(204);
      return res.end();
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Route not found' }));
}
