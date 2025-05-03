import { ServerResponse } from 'http';

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: object
) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
