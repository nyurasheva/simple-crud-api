import { createWriteStream } from 'fs';

const logStream = createWriteStream('server.log', { flags: 'a' });

export function logMessage(message: string) {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${message}\n`);
}

export const log = (...args: unknown[]) => {
  console.log('[LOG]', ...args);
};

export const error = (...args: unknown[]) => {
  console.error('[ERROR]', ...args);
};
