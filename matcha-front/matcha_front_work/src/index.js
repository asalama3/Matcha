import React from 'react';
import ReactDOM from 'react-dom';
import Matcha from './matcha';
import {render} from 'react-dom';
import '../css/index.css';
import Login from './login';
import Welcome from './welcome';
import CreateAccount from './create_account';
import Profile from './profile';
import { Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

render((
  // <matcha />,
  <Router history={browserHistory}>
      <IndexRoute component={Welcome} />
      <Route path="create_account" component={CreateAccount} />
      <Route path="login" component={Login} />
      <Route path="/" component={Matcha} >
        <Route path="profile" component={Profile} />
      </Route>


  </Router>

), document.getElementById('root'))
