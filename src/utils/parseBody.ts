import { IncomingMessage } from 'http';

export async function parseJSONBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString();

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error('Invalid JSON');
  }
}
