import React, { Component } from 'react';
import Header from './header';

class AppHeader extends Component {
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
