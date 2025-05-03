import { ServerResponse } from 'http';

export const handleErrors = (err: unknown, res: ServerResponse) => {
  console.error(err);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};
