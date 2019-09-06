import { useSnackbar } from 'notistack';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, IState } from '../interfaces/client';
import { dismissSnackbar } from '../state/actions';

function stateToProps({ snackbarContent: notifications }: IState) {
  return { notifications };
}

function dispatchToProps(dispatch: Dispatch) {
  return { dismiss() { return dismissSnackbar(); }};
}

const NotificationsBC: React.FC<ReturnType<typeof stateToProps> & ReturnType<typeof dispatchToProps>> =
  ({ notifications, dismiss }) => {
    const { enqueueSnackbar } = useSnackbar();
    // Sorry, I know this is ugly, but I didn't want to re-implement snackbar stacking
    notifications.forEach((not) => enqueueSnackbar(not.message));
    if (notifications.length) {
      setTimeout(() => dismiss());
    }
    return <></>;
  };

export const Notifications = connect(stateToProps, dispatchToProps)(NotificationsBC);
