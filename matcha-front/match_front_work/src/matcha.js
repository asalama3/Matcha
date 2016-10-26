import React, { Component } from 'react';
import './matcha.css';
import { Link } from 'react-router';
import Header from './header';

class matcha extends Component {
  render() {
    console.log(this.props.children);
    return (
      <div>
      <div> Ca cest le header</div>
      <div>
        {this.props.children}
      </div>
      </div>
    );
  }
}
//
// class accueil extends Component {
//   render() {
//     return (
//       <div className="accueil">
//         <button type="button">Login</button>
//         <button type="button">Create Account</button>
//       </div>
//     );
//   }
// }

export default matcha;
// export default accueil;
