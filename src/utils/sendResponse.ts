import { ServerResponse } from 'http';
import { HTTP_STATUS } from '../constants';

export function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown
): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(status === HTTP_STATUS.NO_CONTENT ? undefined : JSON.stringify(body));
}
