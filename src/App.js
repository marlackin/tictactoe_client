import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './component/home';
import Game from './component/game';

export default class App extends React.Component {
    render() {
      return (
        <Router>
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/game" component={Game}/>
            </div>
        </Router>
      );
    }
}
