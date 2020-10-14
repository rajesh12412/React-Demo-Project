import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Test from './components/Test';
// import Summary from './components/Summary';
// import Navigation from './components/Navigation';
import './App.css';

class App extends Component {
  render() {
    return (
    <Router>
        <div>
          <header className="header-part">
         
          <div className="yy-1">
            <h1 className="select-wrap">React Demo search and Update</h1>
          </div>
        </header>          
          <Switch>
              <Route path='/Demo' component={Test} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;