import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Login } from './components/Login';
import { Chat } from './components/Chat';

const App: React.FC = () => {
  return (
    <Router>
      <Route exact path="/" component={Login} />
      <Route path="/chat" component={Chat} />
    </Router>
  );
}

export default App;
