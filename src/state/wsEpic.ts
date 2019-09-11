import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, endWith, filter, map, pluck, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { isActionOf } from 'typesafe-actions';
import { Action, IState } from '../interfaces/client';
import { ServerTransmission } from '../interfaces/common';
import { clientMessage, login, logout, serverMessage } from './actions';

export const wsEpic: Epic<Action, Action, IState> = (action$) => action$.pipe(
  filter(isActionOf(login)),
  switchMap(({ payload: nickname }) => {
    const subject = webSocket(`ws://${window.location.host}/chatWs`);
    // const subject = webSocket('ws://localhost:4000/chatWs');

    // Pipe client message actions to websocket until logout action is received
    action$.pipe(
      // takeWhile((action) => !isActionOf(logout, action)),
      filter(isActionOf(clientMessage)),
      pluck('payload'),
    ).subscribe(subject);

    // Map all server websocket messages to `serverMessage` actions until the logout action is received
    return subject.pipe(
      takeUntil(action$.pipe(filter(isActionOf(logout)))),
      map((msg) => serverMessage(msg as ServerTransmission)),
      startWith(clientMessage({ type: 'authenticate', name: nickname })),
      catchError((err) => of(serverMessage({ type: 'error', message: err.message }))),
      endWith(serverMessage({ type: 'info', message: 'disconnected' })),
    );
  }),
);
