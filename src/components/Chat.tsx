import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Dispatch, IState } from '../interfaces/client';
import { clientMessage, logout } from '../state/actions';
import { ChatMessage } from './chat/ChatMessage';
import { RoomEvent } from './chat/RoomEvent';

const useStyles = makeStyles((theme) => ({
  actions: {},
  appBar: {
    bottom: 0,
    top: 'auto',
  },
  messagePaper: {
    marginBottom: theme.spacing(8),
    marginTop: theme.spacing(3),
  },
  textInput: {
    flexGrow: 1,
  },
}));

function stateToProps({ messages }: IState) {
  return { messages };
}

function dispatchToProps(dispatch: Dispatch) {
  return {
    logout() { return dispatch(logout()); },
    send(message: string) { return dispatch(clientMessage({ type: 'send', message })); },
  };
}

const ChatPure: React.FC<ReturnType<typeof stateToProps> & ReturnType<typeof dispatchToProps>> =
  ({ logout: dispatchLogout, messages, send }) => {
    const classes = useStyles();
    const [ inputText, updateInput ] = useState('');
    function sendMessage() {
      if (inputText) {
        updateInput('');
        send(inputText);
      }
    }
    function keyPress(e: React.KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    }

    return <>
      <Paper className={classes.messagePaper}>
        <List>
          {messages.map((item, idx) => item.type === 'message' ?
            <ChatMessage key={idx} {...item} /> :
            <RoomEvent key={idx} {...item} />,
          )}
        </List>
      </Paper>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <div className={classes.textInput}>
            <InputBase
              autoFocus
              placeholder='Enter message...'
              onChange={(e) => updateInput(e.target.value)}
              onKeyDown={keyPress}
              value={inputText}
            />
          </div>
          <div className={classes.actions}>
            <IconButton onClick={sendMessage} aria-label='Send'><SendIcon /></IconButton>
            <IconButton onClick={() => dispatchLogout()} aria-label='Exit chat'><ExitToAppIcon /></IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>;
  };

export const Chat = connect(stateToProps, dispatchToProps)(ChatPure);
