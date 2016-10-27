import React, { Component } from 'react';
import '../css/matcha.css';
import { Link } from 'react-router';
import Header from './header';

class matcha extends Component {
  render() {
    console.log(this.props.children);
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


export default matcha;
