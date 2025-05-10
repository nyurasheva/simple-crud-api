import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { User, CreateUserData } from './types';
import { MemoryRepository } from './repository';
import { parseJSONBody } from '../utils/parseBody';
import { sendJson } from '../utils/sendResponse';
import { logMessage } from '../utils/logger';
import { HTTP_STATUS, MESSAGES } from '../constants';
import { isValidUserData } from './validate';

const userRepository = new MemoryRepository<User>();

function extractValidUUID(url: string | undefined): string | null {
  const match = url?.match(/^\/users\/([0-9a-fA-F-]{36})$/);
  const id = match ? match[1] : null;
  return id && isUUID(id) ? id : null;
}

export async function userRouter(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;
  res.setHeader('Content-Type', 'application/json');

  logMessage(`Received ${method} request for ${url}`);

  if (method === 'GET' && url === '/users') {
    const users = userRepository.findAll();
    return sendJson(res, HTTP_STATUS.OK, users);
  }

  if (method === 'POST' && url === '/users') {
    try {
      const body = await parseJSONBody<CreateUserData>(req);
      if (!isValidUserData(body)) {
        throw new Error(MESSAGES.INVALID_USER_DATA);
      }
      const newUser: User = { id: uuidv4(), ...body };
      userRepository.create(newUser);
      return sendJson(res, HTTP_STATUS.CREATED, newUser);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === MESSAGES.INVALID_JSON) {
        logMessage('Error: Invalid JSON');
        return sendJson(res, HTTP_STATUS.BAD_REQUEST, {
          message: MESSAGES.INVALID_JSON,
        });
      }
      if (err instanceof Error) {
        logMessage(`Error: ${err.message}`);
        return sendJson(res, HTTP_STATUS.BAD_REQUEST, { message: err.message });
      }
      logMessage('Error: Unknown error occurred');
      return sendJson(res, HTTP_STATUS.BAD_REQUEST, {
        message: MESSAGES.UNKNOWN_ERROR,
      });
    }
  }

  if (url?.startsWith('/users/')) {
    const id = extractValidUUID(url);
    if (!id) {
      return sendJson(res, HTTP_STATUS.BAD_REQUEST, {
        message: MESSAGES.INVALID_USER_ID,
      });
    }

    if (method === 'GET') {
      const user = userRepository.findById(id);
      if (!user) {
        return sendJson(res, HTTP_STATUS.NOT_FOUND, {
          message: MESSAGES.USER_NOT_FOUND,
        });
      }
      return sendJson(res, HTTP_STATUS.OK, user);
    }

    if (method === 'PUT') {
      try {
        const body = await parseJSONBody<CreateUserData>(req);
        if (!isValidUserData(body)) {
          throw new Error(MESSAGES.INVALID_USER_DATA);
        }
        const updatedUser = userRepository.update(id, body);
        if (!updatedUser) {
          return sendJson(res, HTTP_STATUS.NOT_FOUND, {
            message: MESSAGES.USER_NOT_FOUND,
          });
        }
        return sendJson(res, HTTP_STATUS.OK, updatedUser);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === MESSAGES.INVALID_JSON) {
          return sendJson(res, HTTP_STATUS.BAD_REQUEST, {
            message: MESSAGES.INVALID_JSON,
          });
        }
        if (err instanceof Error) {
          return sendJson(res, HTTP_STATUS.BAD_REQUEST, {
            message: err.message,
          });
        }
        return sendJson(res, HTTP_STATUS.BAD_REQUEST, {
          message: MESSAGES.UNKNOWN_ERROR,
        });
      }
    }

    if (method === 'DELETE') {
      const deleted = userRepository.delete(id);
      if (!deleted) {
        return sendJson(res, HTTP_STATUS.NOT_FOUND, {
          message: MESSAGES.USER_NOT_FOUND,
        });
      }
      res.writeHead(HTTP_STATUS.NO_CONTENT);
      return res.end();
    }
  }

  return sendJson(res, HTTP_STATUS.NOT_FOUND, {
    message: MESSAGES.ROUTE_NOT_FOUND,
  });
}
