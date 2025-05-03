import http from 'http';
import dotenv from 'dotenv';
import { userRouter } from './users/router';

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
    console.error('Unhandled error in request handler:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
