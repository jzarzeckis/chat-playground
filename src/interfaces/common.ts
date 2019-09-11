export interface IBroadcastMessage {
  type: 'message';
  author: string;
  message: string;
}

export interface IClientMessage {
  type: 'send';
  message: string;
}

export interface IClientPing {
  type: 'ping';
}

export interface INotificationMessage {
  type: 'info';
  message: 'inactivityTimeout' | 'shutdown' | 'disconnected';
}

export interface IAuthenticationConfirmation {
  type: 'authenticated';
  member: string;
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

export type ServerTransmission = IBroadcastMessage |
  IErrorMessage | INotificationMessage | IRoomEvent |
  IAuthenticationConfirmation;
export type ClientTransmission = IClientMessage | IClientAuthentication | IClientPing;
export type Transmission = ServerTransmission | ClientTransmission;
