import React, { Component } from 'react';
import Header from './header';
// import Button from 'react-bootstrap/lib/Button';


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
