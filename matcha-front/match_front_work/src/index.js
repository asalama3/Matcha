import React from 'react';
import ReactDOM from 'react-dom';
import matcha from './matcha';
import {render} from 'react-dom';
import './index.css';
import Login from './login';
import test from './test';
import { Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

render((
  // <matcha />,
  <Router history={browserHistory}>
    <Route path="/" component={matcha} >
      <IndexRoute component={test} />
    <Route path="login" component={Login} />
    </Route>
  </Router>

), document.getElementById('root'))
