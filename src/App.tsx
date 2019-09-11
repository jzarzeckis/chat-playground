import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
import { Chat } from './components/Chat';
import { Login } from './components/Login';
import { Notifications } from './components/Notifications';
import { IState } from './interfaces/client';

const theme = createMuiTheme({
  palette: { type: 'dark' },
});

function mapStateToAuth({ name }: IState) {
  return { isAuthenticated: name !== null };
}

function redirectBasedOnAuth(
  shouldbeAuthenticated: boolean,
  Component: React.ComponentType,
  redirectPath: string,
) {
  return connect(mapStateToAuth)((({ isAuthenticated }) =>
    isAuthenticated === shouldbeAuthenticated ?
      <Component /> :
      <Redirect to={redirectPath} />
  ) as React.FC<ReturnType<typeof mapStateToAuth>>);
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Container>
          <CssBaseline />
          <Router>
            <Route exact path='/' component={redirectBasedOnAuth(false, Login, '/chat')} />
            <Route path='/chat' component={redirectBasedOnAuth(true, Chat, '/')} />
          </Router>
        </Container>
        <Notifications />
      </SnackbarProvider>
    </ThemeProvider>
);
};

export default App;
