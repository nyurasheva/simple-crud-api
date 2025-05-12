import { ServerResponse } from 'http';
import { error } from '../utils/logger';
import { HTTP_STATUS } from '../constants';

export const handleErrors = (err: unknown, res: ServerResponse) => {
  error(err);
  res.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};
