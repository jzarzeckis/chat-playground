import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { Dispatch, IState } from '../interfaces/client';
import { ChatMessage } from './chat/ChatMessage';
import { RoomEvent } from './chat/RoomEvent';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send'
import { connect } from 'react-redux';
import { logout, clientMessage } from '../state/actions';

const useStyles = makeStyles(theme => ({
  messagePaper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),
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

function stateToProps({ messages }: IState) {
  return { messages };
}

function dispatchToProps(dispatch: Dispatch) {
  return {
    logout() { return dispatch(logout())},
    send(message: string) { return dispatch(clientMessage({ type: 'send', message })) },
  };
}

const ChatPure: React.FC<ReturnType<typeof stateToProps> & ReturnType<typeof dispatchToProps>> = ({ messages, logout, send }) => {
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
            onChange={(e) => updateInput(e.target.value)}
            onKeyDown={keyPress}
            value={inputText}
          />
        </div>
        <div className={classes.actions}>
          <IconButton onClick={sendMessage} aria-label="Send"><SendIcon /></IconButton>
          <IconButton onClick={() => logout()} aria-label="Exit chat"><ExitToAppIcon /></IconButton>
        </div>
      </Toolbar>
    </AppBar>
  </>;
};

export const Chat = connect(stateToProps, dispatchToProps)(ChatPure);
