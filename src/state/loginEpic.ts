import { Epic } from 'redux-observable';
import { exhaustMap, filter, takeWhile, startWith, tap, takeUntil, ignoreElements } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { isActionOf } from 'typesafe-actions';
import { Action, IState } from '../interfaces/client';
import { login, logout, serverMessage } from './actions';
import { Transmission } from '../interfaces/common';

export const wsEpic: Epic<Action, Action, IState> = (action$) => action$.pipe(
  filter(isActionOf(login.request)),
  tap(x => console.log("Got action", x)),
  exhaustMap(() => {
    const subject = webSocket(`ws://${window.location.host}/chatWs`);
    
    // Pipe actions to websocket until receiving logout action
    action$.pipe(
      takeWhile((action) => !isActionOf(logout, action)),
      ignoreElements(),
      startWith({ type: 'authenticate', name: payload })
    ).subscribe(subject);

    return subject.pipe(
      takeUntil($action$.pipe(filter(isActionOf(logout)))),
      map(msg => serverMessage(msg as any))
    ).
  })
);
