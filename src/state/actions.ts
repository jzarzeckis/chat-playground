import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { ServerTransmission } from '../interfaces/common';
export const login = createAsyncAction(
  'JOIN_ROOM',
  'AUTHENTICATED',
  'JOIN_FAILURE',
)<string, void, void>();

export const logout = createStandardAction('LOGOUT')();

export const serverMessage = createStandardAction('RX')<ServerTransmission>();