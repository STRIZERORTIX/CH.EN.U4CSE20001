// @ts-ignore
import React, { Component } from 'react';
// @ts-ignore
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Trains from './components/Trains';
import Train from './components/Train';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/trains" component={Trains} />
          <Route path="/trains/:trainNumber" component={Train} />
        </Switch>
      </Router>
    );
  }
}

export default App;