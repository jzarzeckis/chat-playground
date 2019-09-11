import * as WebSocket from 'ws';
import { ServerTransmission } from '../interfaces/common';
import { Member } from './chatMember';
import { config } from './config';
import { logger } from './logger';

export class ChatRoom {
  private members: Member[] = [];

  constructor(private server: WebSocket.Server) {
    this.server.on('connection', (ws: WebSocket) => {
      logger.debug('client connected');
      this.members.push(new Member(ws, this));
    });

    setInterval(() => {
      this.disconnectInactiveUsers();
    }, 10000);
  }

  /**
   * Broadcasts a message to all authenticated members of the room
   * @param author Name of the message author
   * @param message Message content
   */
  public broadcast(payload: ServerTransmission) {
    const data = JSON.stringify(payload);
    this.members.filter((m) => m.name !== null).forEach((m) => {
      m.ws.send(data);
    });
  }

  public nameExists(name: string) {
    return this.members.some((m) => m.name === name);
  }

  private disconnectInactiveUsers() {
    const stale = Date.now() - config.inactivityTimeout;
    const staleMembers = this.members.filter((m) => m.lastActivity < stale);
    logger.debug('Disconnecting stale members: %s', staleMembers.map((m) => m.name).join(', '));
    staleMembers.forEach((m) => {
      m.disconnectDueToTimeout();
    });

    this.members = this.members.filter((m) => m.lastActivity >= stale);
  }
}
