import ListSubheader from '@material-ui/core/ListSubheader';
import React, { forwardRef, RefForwardingComponent } from 'react';
import { IRoomEvent } from '../../interfaces/common';

const RoomEventRFC: RefForwardingComponent<any, IRoomEvent> = ({ event, member }, ref) => <ListSubheader ref={ref}>
  {
    event === 'join' ? `${member} joined the chat` :
    event === 'leave' ? `${member} left the chat` :
      `${member} was disconnected due to timeout`
  }
</ListSubheader>;

export const RoomEvent = forwardRef(RoomEventRFC);
