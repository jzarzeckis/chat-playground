import { MutableRefObject } from 'react';
import { Dispatch as RDispatch } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as actions from '../state/actions';
import {
  IBroadcastMessage,
  IErrorMessage,
  IRoomEvent,
} from './common';

export type ChatItem = IBroadcastMessage | IRoomEvent;

export type Action = ActionType<typeof actions>;

export interface IState {
  name: string | null;
  messages: Array<IBroadcastMessage | IRoomEvent>;
  snackbarContent: IErrorMessage[];
}

export type Dispatch = RDispatch<Action>;
