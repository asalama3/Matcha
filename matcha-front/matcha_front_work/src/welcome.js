import React from 'react';
import { Link } from 'react-router';
import '../css/welcome.css';


class Welcome extends React.Component {
  render() {
    return (
      <div className="welcome">
      <link href="https://fonts.googleapis.com/css?family=Cookie|Cormorant+Upright|Playball|Shadows+Into+Light+Two|Tangerine" rel="stylesheet"/>

        <div className="button">
        <p>WELCOME TO MATCHA </p>
          <Link className="button_style" to="login"> Login </Link>
          <Link className="button_style" to="create_account"> Create Account </Link>
        </div>
      </div>
    )
  }
}

export default Welcome;
