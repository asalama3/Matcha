import React, { Component } from 'react';
import '../css/matcha.css';
import { Link } from 'react-router';
import Header from './header';
import Button from 'react-bootstrap/lib/Button';


class matcha extends Component {
  render() {

    console.log(this.props.children);
    return (
      <div>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
        <Header />
          <Button bsStyle="primary" bsSize="large">Large button</Button>
          <Button bsSize="large">Large button</Button>
          <div>
          {this.props.children}
          </div>
      </div>
    );
  }
}

export default matcha;
