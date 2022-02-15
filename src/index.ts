import { createServer } from 'http';

import app from './app';
import config from './utils/config';
import { createLogger } from './utils/logger';

import routes from './routes';

const logger = createLogger(config.env === 'development');
const server = createServer(app);

routes(app, config.server.apiKey);

server.listen(config.server.port, async () => {
  logger.info(`Listening on port ${config.server.port}`);
});