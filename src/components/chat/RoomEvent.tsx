import ListSubheader from '@material-ui/core/ListSubheader';
import React from 'react';
import { IRoomEvent } from '../../interfaces/common';

export const RoomEvent: React.FC<IRoomEvent> = ({ event, member }) => <ListSubheader>
  {
    event === 'join' ? `${member} joined the chat` :
    event === 'leave' ? `${member} left the chat` :
      `${member} was disconnected due to timeout`
  }
</ListSubheader>;
