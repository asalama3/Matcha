import React from 'react';
import { render } from 'react-dom';
import { Redirect, Router, Route, browserHistory, IndexRoute } from 'react-router';
import AppHeader from './AppHeader';
import App from './App';
import '../css/index.css';
import Welcome from './welcome';
import Profile from './profile';
import editProfile from './editProfile';
import editPictures from './editPictures';
import Search from './search';
import Chat from './chats';
import Notifications from './notifications';
// import deleteAccount from './delete_account';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={Welcome} />
    </Route>
    <Route path="/matcha" component={AppHeader} >
          <Route path="profile" component={Profile} />
          <Route path="profile/:user" component={Profile} />
          <Route path="editProfile" component={editProfile} />
          <Route path="editPictures" component={editPictures} />
          <Route path="search" component={Search} />
          <Route path="chat" component={Chat} />
          <Route path="notifications" component={Notifications} />
    </Route>
    <Redirect from='*' to='/matcha/profile' component={App} />
  </Router>

), document.getElementById('root'));

//        <Route path="login" test="tesdwdwt" component={Login} />
