import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { ChatItem } from '../interfaces/client';
import { ChatMessage } from './chat/ChatMessage';
import { RoomEvent } from './chat/RoomEvent';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles(theme => ({
  messagePaper: {
    marginTop: theme.spacing(3)
  },
  appBar: {
    top: 'auto',
    bottom: 0
  },
  textInput: {
    flexGrow: 1
  },
  actions: {}
}));

const dummy: ChatItem[] = [
  { type: 'message', author: 'Judy', message: 'Welcome to the chat' },
  { type: 'roomevent', event: 'leave', member: 'Somebody' }
]

export const Chat: React.FC = () => {
  const classes = useStyles();
  return <>
    <Paper className={classes.messagePaper}>
      <List>
        {dummy.map((item, idx) => item.type === 'message' ?
          <ChatMessage key={idx} {...item} /> :
          <RoomEvent key={idx} {...item} />
        )}
      </List>
    </Paper>
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <div className={classes.textInput}>
          <InputBase
            autoFocus
            placeholder="Enter message..."
          />
        </div>
        <div className={classes.actions}>
          <IconButton aria-label="Send"><SendIcon /></IconButton>
          <IconButton aria-label="Exit chat"><ExitToAppIcon /></IconButton>
        </div>
      </Toolbar>
    </AppBar>
  </>;
};
