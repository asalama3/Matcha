import React, { Component } from 'react';
import Header from './header';
import io from 'socket.io-client';

class AppHeader extends Component {
  componentWillMount() {
    global.socket = io('http://localhost:8080');
    global.socket.emit('auth', localStorage.getItem('token'));
  }

  render() {
    return (
      <div>
        <Header />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AppHeader;
