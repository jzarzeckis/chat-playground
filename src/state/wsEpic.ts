import { Epic } from 'redux-observable';
import { interval, merge, NEVER, Observable, of, race, TimeoutError } from 'rxjs';
import { catchError, endWith, filter, map, mapTo, pluck, startWith, switchMap, takeUntil, takeWhile, timeout } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { ActionType, isActionOf } from 'typesafe-actions';
import { Action, IState } from '../interfaces/client';
import { ClientTransmission, IClientPing, ServerTransmission } from '../interfaces/common';
import { config } from '../server/config';
import { clientMessage, login, logout, serverMessage } from './actions';

const { clientConnectionTimeout, pingInterval } = config;

function mapErrors(err: Error | Event): Observable<ActionType<typeof serverMessage>> {
  if (err instanceof TimeoutError) {
    return of(serverMessage({ type: 'error', message: 'Failed to connect (timeout)' }));
  } else if (err instanceof Event) {
    return of(serverMessage({ type: 'error', message: 'Websocket connection failed' }));
  }
  return of(serverMessage({ type: 'error', message: err.message }));
}

export const wsEpic: Epic<Action, Action, IState> = (action$) => action$.pipe(
  filter(isActionOf(login)),
  switchMap(({ payload: nickname }) => {
    const subject = webSocket(`ws://${window.location.host}/chatWs`);

    const clientObservable: Observable<ClientTransmission> = merge(
      // Pipe client message actions to websocket until logout action is received
      action$.pipe(
        filter(isActionOf(clientMessage)),
        pluck('payload'),
      ),
      // Send ping message every 5000 ms to avoid disconnect timeout
      interval(pingInterval).pipe(
        mapTo({ type: 'ping' } as IClientPing),
      ),
    ).pipe(
      // Close subscription and stop sending messages as soon as logout action is received
      takeWhile((action) => !isActionOf(logout, action)),
    );
    clientObservable.subscribe(subject);

    return race(
      NEVER.pipe(timeout(clientConnectionTimeout)), // Emit failure if first message from server is not received in time
      subject.pipe(
        // Map all server websocket messages to `serverMessage` actions until the logout action is received
        takeUntil(action$.pipe(filter(isActionOf(logout)))),
        map((msg) => serverMessage(msg as ServerTransmission)),
      ),
    ).pipe(
      startWith(clientMessage({ type: 'authenticate', name: nickname })),
      catchError(mapErrors),
      endWith(serverMessage({ type: 'info', message: 'disconnected' })),
    );
  }),
);
