import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Login } from './components/Login';
import { Chat } from './components/Chat';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: { type: 'dark' }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Router>
          <Route exact path="/" component={Login} />
          <Route path="/chat" component={Chat} />
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
