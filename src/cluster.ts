import cluster from 'cluster';
import { cpus } from 'os';
import { createServer } from 'http';
import { userRouter } from './users/router';
import { handleErrors } from './middleware/errorHandler';
import dotenv from 'dotenv';
import { log } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;
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
  const server = createServer(async (req, res) => {
    try {
      await userRouter(req, res);
    } catch (err) {
      handleErrors(err, res);
    }
  });

  server.listen(PORT, () => {
    log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
