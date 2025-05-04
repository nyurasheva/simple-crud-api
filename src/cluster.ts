import cluster from 'cluster';
import { cpus } from 'os';
import dotenv from 'dotenv';
import { createAppServer } from './app';
import { log } from './utils/logger';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  log(`Primary ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  const server = createAppServer();
  server.listen(PORT, () => {
    log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
