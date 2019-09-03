export interface BroadcastMessage {
  type: 'message';
  author: string;
  message: string;
}

export interface ClientMessage {
  type: 'send';
  message: string;
}

export interface NotificationMessage {
  type: 'info';
  message: 'authenticated' | 'inactivityTimeout' | 'shutdown';
}

export interface RoomEvent {
  type: 'roomevent';
  event: 'join' | 'leave' | 'timeout';
  member: string;
}

export interface ClientAuthentication {
  type: 'authenticate';
  name: string;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export type ServerTransmission = BroadcastMessage | ErrorMessage | NotificationMessage | RoomEvent;
export type ClientTransmission = ClientMessage | ClientAuthentication;
export type Transmission = ServerTransmission | ClientTransmission;
