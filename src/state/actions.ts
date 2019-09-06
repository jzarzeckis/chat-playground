import { createStandardAction } from 'typesafe-actions';
import { ClientTransmission, ServerTransmission, IErrorMessage } from '../interfaces/common';

export const login = createStandardAction('JOIN_ROOM')<string>();

export const logout = createStandardAction('LOGOUT')();

export const serverMessage = createStandardAction('RX')<ServerTransmission>();

export const clientMessage = createStandardAction('TX')<ClientTransmission>();

export const dismissSnackbar = createStandardAction('DISMISS')();
