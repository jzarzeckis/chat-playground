import { getType, Reducer } from 'typesafe-actions';
import { Action, IState  } from '../interfaces/client';
import { logout } from './actions';

const initialState: IState = {
  messages: [],
  name: null,
  snackbarContent: [],
};

export const reducer: Reducer<IState, Action> = (state = initialState, action) => {
  switch (action.type) {
    case getType(logout):
      return { ...state, name: null };
  }
  return state;
};
