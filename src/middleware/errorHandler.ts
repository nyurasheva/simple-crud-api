import { ServerResponse } from 'http';
import { error } from '../utils/logger';

export const handleErrors = (err: unknown, res: ServerResponse) => {
  error(err);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};
