import http from 'http';
import dotenv from 'dotenv';
import { userRouter } from './users/router';
import { log, error } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api')) {
      req.url = req.url.slice(4);
      return await userRouter(req, res);
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Route not found' }));
  } catch (err: unknown) {
    error('Unhandled error in request handler:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  log(`Server is listening on port ${PORT}`);
});
