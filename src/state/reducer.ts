import { getType, Reducer } from 'typesafe-actions';
import { Action, IState  } from '../interfaces/client';
import { logout, serverMessage } from './actions';

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
      } else if (msg.type === 'info' && msg.message === 'disconnected') {
        return { messages: [], name: null, snackbarContent: [{ type: 'error', message: 'You have been disconnected' }]};
      } else if (msg.type === 'message' || msg.type === 'roomevent') {
        return { ...state, messages: [...state.messages, msg]};
      }
  }
  return state;
};
