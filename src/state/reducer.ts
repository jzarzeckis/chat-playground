import { getType, Reducer } from 'typesafe-actions';
import { Action, IState  } from '../interfaces/client';
import { dismissSnackbar, logout, serverMessage } from './actions';

const initialState: IState = {
  messages: [],
  name: null,
  snackbarContent: [],
};

export const reducer: Reducer<IState, Action> = (state = initialState, action) => {
  switch (action.type) {
    case getType(logout):
      return { ...state, name: null };
    case getType(serverMessage):
      const msg = action.payload;
      if (msg.type === 'authenticated') {
        return { ...state, name: msg.member };
      } else if (msg.type === 'error') {
        return { ...state, snackbarContent: [...state.snackbarContent, msg] };
      } else if (msg.type === 'info' && msg.message === 'inactivityTimeout') {
        return { ...state, snackbarContent: [...state.snackbarContent, {
          message: 'Disconnected from server due to inactivity',
          type: 'error',
        }]};
      } else if (msg.type === 'info' && msg.message === 'disconnected') {
        return { messages: [], name: null, snackbarContent: [{
          isInfo: true,
          message: 'You are now disconnected',
          type: 'error',
        }]};
      } else if (msg.type === 'message' || msg.type === 'roomevent') {
        return { ...state, messages: [...state.messages, msg]};
      }
      break;
    case getType(dismissSnackbar):
      return { ...state, snackbarContent: state.snackbarContent.filter((x) => x !== action.payload) };
  }
  return state;
};
