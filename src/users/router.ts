import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { User, CreateUserData } from './types';
import { MemoryRepository } from './repository';
import { parseJSONBody } from '../utils/parseBody';
import { sendJson } from '../utils/sendResponse';

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
    return sendJson(res, 200, users);
  }

  if (method === 'POST' && url === '/users') {
    try {
      const body = await parseJSONBody<CreateUserData>(req);
      if (!isValidUserData(body)) {
        throw new Error('Invalid user data');
      }
      const newUser: User = { id: uuidv4(), ...body };
      userRepository.create(newUser);
      return sendJson(res, 201, newUser);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Invalid JSON') {
        return sendJson(res, 400, { message: 'Invalid JSON' });
      }
      if (err instanceof Error) {
        return sendJson(res, 400, { message: err.message });
      }
      return sendJson(res, 400, { message: 'Unknown error occurred' });
    }
  }

  if (url?.startsWith('/users/')) {
    const id = extractValidUUID(url);
    if (!id) {
      return sendJson(res, 400, { message: 'Invalid userId' });
    }

    if (method === 'GET') {
      const user = userRepository.findById(id);
      if (!user) {
        return sendJson(res, 404, { message: 'User not found' });
      }
      return sendJson(res, 200, user);
    }

    if (method === 'PUT') {
      try {
        const body = await parseJSONBody<CreateUserData>(req);
        if (!isValidUserData(body)) {
          throw new Error('Invalid user data');
        }
        const updatedUser: User = { id, ...body };
        const success = userRepository.update(id, body);
        if (!success) {
          return sendJson(res, 404, { message: 'User not found' });
        }
        return sendJson(res, 200, updatedUser);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === 'Invalid JSON') {
          return sendJson(res, 400, { message: 'Invalid JSON' });
        }
        if (err instanceof Error) {
          return sendJson(res, 400, { message: err.message });
        }
        return sendJson(res, 400, { message: 'Unknown error occurred' });
      }
    }

    if (method === 'DELETE') {
      const deleted = userRepository.delete(id);
      if (!deleted) {
        return sendJson(res, 404, { message: 'User not found' });
      }
      return sendJson(res, 204, {});
    }
  }

  return sendJson(res, 404, { message: 'Route not found' });
}
