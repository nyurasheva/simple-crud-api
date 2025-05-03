import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const requestListener = (
  _req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Server is running!' }));
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
