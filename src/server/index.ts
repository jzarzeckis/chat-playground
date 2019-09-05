import { Server } from 'ws';
import { ChatRoom } from './chatRoom';
import { logger } from './logger';

const WS_PORT = parseInt(process.env.WS_PORT || '4000', 10);

const wss = new Server({
  path: '/chatWs',
  port: WS_PORT,
});

logger.info('Server is running on port: %d', WS_PORT);

const room = new ChatRoom(wss);

const killHandle: NodeJS.SignalsListener = (e) => {
  logger.info('Received: %s', e);
  logger.info('Stopping server...');
  room.broadcast({ type: 'info', message: 'shutdown' });
  wss.close((err) => {
    if (err) {
      logger.error(err.message);
    }
    process.exit(err ? 1 : 0);
  });
};

process.on('SIGTERM', killHandle);
process.on('SIGINT', killHandle);
