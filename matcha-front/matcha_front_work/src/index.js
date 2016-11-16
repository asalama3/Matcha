import React from 'react';
import ReactDOM from 'react-dom';
import AppHeader from './AppHeader';
import App from './App';
import {render} from 'react-dom';
import '../css/index.css';
import Login from './login';
import Welcome from './welcome';
import CreateAccount from './create_account';
import Profile from './profile';
import editProfile from './editProfile';
import editLocation from './editLocation';

import { Router, Route, Link, browserHistory, IndexRoute} from 'react-router';

render((
  // <matcha />,
  <Router history={browserHistory}>
    <Route path="/" component={App} >
          <IndexRoute component={Welcome} />
          <Route path="create_account" component={CreateAccount} />
          <Route path="login" test="tesdwdwt" component={Login} />
    </Route>
    <Route path="/matcha" component={AppHeader} >
          <Route path="profile"  component={Profile} />
          <Route path="editProfile" component={editProfile} />
          // <Route path="editLocation" component={editLocation} />
    </Route>
  </Router>

), document.getElementById('root'))
