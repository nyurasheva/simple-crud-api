import { createAppServer } from './app';
import dotenv from 'dotenv';
import { log } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createAppServer();

server.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
});
