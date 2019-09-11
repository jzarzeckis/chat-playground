import { withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, IState } from '../interfaces/client';
import { IErrorMessage } from '../interfaces/common';
import { dismissSnackbar } from '../state/actions';

function stateToProps({ snackbarContent: notifications }: IState) {
  return { notifications };
}

function dispatchToProps(dispatch: Dispatch) {
  return { dismiss(n: IErrorMessage) { dispatch(dismissSnackbar(n)); }};
}

const NotificationsBC: React.FC<
  WithSnackbarProps &
  ReturnType<typeof stateToProps> &
  ReturnType<typeof dispatchToProps>
> = ({ notifications, dismiss, enqueueSnackbar }) => {
  const [ notificationsShown, updateNotificationsShown ] = useState(new WeakSet<IErrorMessage>());
  useEffect(() => {
    notifications.filter((n) => !notificationsShown.has(n)).forEach((n) => {
      enqueueSnackbar(n.message, {
        onClose() {
          dismiss(n);
          notificationsShown.delete(n);
          updateNotificationsShown(notificationsShown);
        },
        variant: n.isInfo ? 'info' : 'warning',
      });
      notificationsShown.add(n);
    });
  }, [ notifications ]);
  return null;
};

export const Notifications = withSnackbar(connect(stateToProps, dispatchToProps)(NotificationsBC));
