import { applyMiddleware, createStore, Store } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { Action, IState } from '../interfaces/client';
import { reducer } from './reducer';
import { wsEpic } from './wsEpic';

const epicMiddleware = createEpicMiddleware<Action, Action, IState>();

export const store: Store<IState, Action> = createStore(
  reducer,
  applyMiddleware(epicMiddleware),
);

epicMiddleware.run(combineEpics(wsEpic));
