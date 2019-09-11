import * as WebSocket from 'ws';
import { ClientTransmission, ServerTransmission } from '../interfaces/common';
import { ChatRoom } from './chatRoom';
import { logger } from './logger';

export class Member {
  /**
   * The nickname the member has entered
   * (Unauthenticated members have null as name)
   * Broadcasted messages will only be sent to members that have name set
   */
  public name: string | null = null;
  public lastActivity = Date.now();
  constructor(
    public ws: WebSocket,
    private room: ChatRoom,
  ) {
    ws.on('message', (msg: string) => {
      try {
        const data = JSON.parse(msg) as ClientTransmission;
        if (data.type === 'authenticate') {
          // Already authenticated members shouldn't re-authenticate
          if (this.name !== null) {
            this.send({ type: 'error', message: 'You are already authenticated' });
            return;
          }
          if (this.room.nameExists(data.name)) {
            this.send({ type: 'error', message: 'Such name has already been taken' });
            return;
          }
          logger.debug('User authenticated: %s', this.name);
          this.room.broadcast({ type: 'roomevent', event: 'join', member: data.name });
          this.name = data.name;
          this.send({ type: 'authenticated', member: this.name });
          this.lastActivity = Date.now();
        } else if (data.type === 'send') {
          if (this.name === null) {
            this.send({ type: 'error', message: 'Unauthenticated users can\'t send messages'});
            return;
          }
          this.room.broadcast({ type: 'message', author: this.name, message: data.message });
          this.lastActivity = Date.now();
        } else {
          logger.error('Invalid message type sent by client');
        }
      } catch (err) {
        logger.error('Invalid JSON sent by client');
      }
    });

    ws.on('close', () => {
      const name = this.name;
      this.name = null;
      this.lastActivity = 0;

      logger.debug('Client disconnected: %s', name);

      if (name) {
        this.room.broadcast({ type: 'roomevent', event: 'leave', member: name });
      }
    });
  }

  public send(payload: ServerTransmission) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  public disconnectDueToTimeout() {
    const name = this.name;
    this.name = null;
    if (![WebSocket.CLOSED, WebSocket.CLOSING].includes(this.ws.readyState)) {
      return;
    }
    this.send({type: 'info', message: 'inactivityTimeout' });
    logger.debug('Disconnecting inactive user: %s', name);
    if (name) { // Users may get disconnected before they got authenticated
      this.room.broadcast({ type: 'roomevent', event: 'timeout', member: name });
    }

    this.ws.close();
  }
}
