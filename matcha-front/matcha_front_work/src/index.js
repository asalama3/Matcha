import React from 'react';
import ReactDOM from 'react-dom';
import Matcha from './matcha';
import {render} from 'react-dom';
import '../css/index.css';
import Login from './login';
import Welcome from './welcome';
import CreateAccount from './create_account';
import { Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

render((
  // <matcha />,
  <Router history={browserHistory}>
    <Route path="/" component={Matcha} >
      <IndexRoute component={Welcome} />
      <Route path="login" component={Login} />
      <Route path="create_account" component={CreateAccount} />
    </Route>
  </Router>

), document.getElementById('root'))
