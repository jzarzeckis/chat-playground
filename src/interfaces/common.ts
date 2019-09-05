export interface IBroadcastMessage {
  type: 'message';
  author: string;
  message: string;
}

export interface IClientMessage {
  type: 'send';
  message: string;
}

export interface INotificationMessage {
  type: 'info';
  message: 'authenticated' | 'inactivityTimeout' | 'shutdown';
}

export interface IRoomEvent {
  type: 'roomevent';
  event: 'join' | 'leave' | 'timeout';
  member: string;
}

export interface IClientAuthentication {
  type: 'authenticate';
  name: string;
}

export interface IErrorMessage {
  type: 'error';
  message: string;
}

export type ServerTransmission = IBroadcastMessage | IErrorMessage | INotificationMessage | IRoomEvent;
export type ClientTransmission = IClientMessage | IClientAuthentication;
export type Transmission = ServerTransmission | ClientTransmission;
