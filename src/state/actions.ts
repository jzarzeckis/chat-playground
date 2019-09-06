import { createStandardAction } from 'typesafe-actions';
import { ClientTransmission, ServerTransmission } from '../interfaces/common';

export const login = createStandardAction('JOIN_ROOM')<string>();

export const logout = createStandardAction('LOGOUT')();

export const serverMessage = createStandardAction('RX')<ServerTransmission>();

export const clientMessage = createStandardAction('TX')<ClientTransmission>();