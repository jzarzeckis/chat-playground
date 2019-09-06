import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Login } from './components/Login';
import { Chat } from './components/Chat';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { IState } from './interfaces/client';
import { connect } from 'react-redux';

const theme = createMuiTheme({
  palette: { type: 'dark' }
});

function mapStateToAuth({ name }: IState) {
  return { isAuthenticated: name !== null };
}

function redirectBasedOnAuth(
  shouldbeAuthenticated: boolean,
  Component: React.ComponentType,
  redirectPath: string
) {
  return connect(mapStateToAuth)((({ isAuthenticated }) => <>{
    isAuthenticated === shouldbeAuthenticated ?
      <Component /> :
      <Redirect to={redirectPath} />
  }</>) as React.FC<ReturnType<typeof mapStateToAuth>>);
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Router>
          <Route exact path="/" component={redirectBasedOnAuth(false, Login, '/chat')} />
          <Route path="/chat" component={redirectBasedOnAuth(true, Chat, '/')} />
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
