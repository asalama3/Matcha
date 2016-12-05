import React from 'react';
// import ReactDOM from 'react-dom';
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
import editPictures from './editPictures';
import Search from './search';
import * as logout from './logout';
import deleteAccount from './delete_account';

// console.log('couocu')

import { Router, Route, browserHistory, IndexRoute} from 'react-router';

render((
  // <matcha />,
  <Router history={browserHistory}>
    <Route path="/" component={App} >
    <IndexRoute component={Welcome} />
    </Route>
    <Route path="/matcha" component={AppHeader} >
          <Route path="profile"  component={Profile} />
          <Route path="profile/:user"  component={Profile} />
          <Route path="editProfile" component={editProfile} />
          <Route path="editPictures" component={editPictures} />
          <Route path="search" component={Search} />
          <Route path="logout" component={logout.logout} />
          <Route path="delete_account" component={deleteAccount} />
          // <Route path="editLocation" component={editLocation} />
    </Route>
  </Router>

), document.getElementById('root'))


//          <Route path="login" test="tesdwdwt" component={Login} />
//        <Route path="login" test="tesdwdwt" component={Login} />
