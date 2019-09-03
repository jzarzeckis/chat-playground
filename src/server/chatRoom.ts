import * as WebSocket from 'ws';
import { logger } from './logger';
import { ServerTransmission, ClientTransmission } from '../interfaces/common';
import { config } from './config';

class Member {
  /**
   * The nickname the member has entered
   * (Unauthenticated members have null as name)
   * Broadcasted messages will only be sent to members that have name set
   */
  public name: string | null = null;
  public lastActivity = Date.now();
  constructor(
    public ws: WebSocket,
    private room: ChatRoom
  ) {
    ws.on('message', (msg: string) => {
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
        this.send({ type: 'info', message: 'authenticated' });
        this.lastActivity = Date.now();
      } else if (data.type === 'send') {
        if (this.name === null) {
          this.send({ type: 'error', message: 'Unauthenticated users can\'t send messages'});
          return;
        }
        this.room.broadcast({ type: 'message', author: this.name, message: data.message });
        this.lastActivity = Date.now();
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
    })
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
   * @param author 
   * @param message 
   */
  public broadcast(payload: ServerTransmission) {
    const data = JSON.stringify(payload);
    this.members.filter(m => m.name !== null).forEach(m => {
      m.ws.send(data);
    });
  }

  private disconnectInactiveUsers() {
    const stale = Date.now() - config.inactivityTimeout;
    const staleMembers = this.members.filter(m => m.lastActivity < stale);
    logger.debug('Disconnecting stale members: %s', staleMembers.map(m => m.name).join(', '));
    staleMembers.forEach(m => {
      m.disconnectDueToTimeout();
    });

    this.members = this.members.filter(m => m.lastActivity >= stale);
  }

  public nameExists(name: string) {
    return this.members.some(m => m.name === name);
  }
}