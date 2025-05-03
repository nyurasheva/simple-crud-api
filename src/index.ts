import http from 'http';
import dotenv from 'dotenv';
import { userRouter } from './users/router';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api')) {
    req.url = req.url.slice(4);
    return userRouter(req, res);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
