import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { ChatItem } from '../interfaces/client';
import { ChatMessage } from './chat/ChatMessage';
import { RoomEvent } from './chat/RoomEvent';

const useStyles = makeStyles(theme => ({
  messagePaper: {
    marginTop: theme.spacing(3)
  },
  appBar: {
    top: 'auto',
    bottom: 0
  },
  list: {}
}));

const dummy: ChatItem[] = [
  { type: 'message', author: 'Judy', message: 'Welcome to the chat' },
  { type: 'roomevent', event: 'leave', member: 'Somebody' }
]

export const Chat: React.FC = () => {
  const classes = useStyles();
  return <>
    <Paper className={classes.messagePaper}>
      <List className={classes.list}>
        {dummy.map((item, idx) => item.type === 'message' ?
          <ChatMessage key={idx} {...item} /> :
          <RoomEvent key={idx} {...item} />
        )}
      </List>
    </Paper>
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>Hello world</Toolbar>
    </AppBar>
  </>;
};
