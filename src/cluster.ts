import cluster from 'cluster';
import { cpus, availableParallelism } from 'os';
import dotenv from 'dotenv';
import http from 'http';
import { createAppServer } from './app';
import { log } from './utils/logger';

dotenv.config();

const BASE_PORT = Number(process.env.PORT) || 4000;
const numCPUs = availableParallelism ? availableParallelism() : cpus().length;
const workerPorts: number[] = [];

if (cluster.isPrimary) {
  log(`Primary ${process.pid} is running`);

  for (let i = 1; i < numCPUs; i++) {
    const workerPort = BASE_PORT + i;
    workerPorts.push(workerPort);
    cluster.fork({ WORKER_PORT: workerPort });
  }

  let currentIndex = 0;

  const loadBalancer = http.createServer((req, res) => {
    const targetPort = workerPorts[currentIndex];
    currentIndex = (currentIndex + 1) % workerPorts.length;

    const proxy = http.request(
      {
        hostname: 'localhost',
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    proxy.on('error', (err) => {
      res.writeHead(500);
      res.end(`Proxy error: ${err.message}`);
    });

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(BASE_PORT, () => {
    log(`Load balancer running on port ${BASE_PORT}`);
  });

  cluster.on('exit', (worker) => {
    log(`Worker ${worker.process.pid} died, restarting...`);
    const port = workerPorts.pop() || BASE_PORT + numCPUs;
    workerPorts.push(port);
  });
} else {
  const WORKER_PORT = Number(process.env.WORKER_PORT);
  const server = createAppServer();
  server.listen(WORKER_PORT, () => {
    log(`Worker ${process.pid} started on port ${WORKER_PORT}`);
  });
}
