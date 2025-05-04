import http from 'http';
import dotenv from 'dotenv';
import { userRouter } from './users/router';
import { handleErrors } from './middleware/errorHandler';
import { sendJson } from './utils/sendResponse';
import { HTTP_STATUS, MESSAGES } from './constants';

dotenv.config();

export function createAppServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.url?.startsWith('/api')) {
        req.url = req.url.slice(4);
        return await userRouter(req, res);
      }
      return sendJson(res, HTTP_STATUS.NOT_FOUND, {
        message: MESSAGES.ROUTE_NOT_FOUND,
      });
    } catch (err: unknown) {
      return handleErrors(err, res);
    }
  });
}
