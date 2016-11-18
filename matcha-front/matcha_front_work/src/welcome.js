import React from 'react';
import { Link } from 'react-router';
import '../css/welcome.css';


class Welcome extends React.Component {
  render() {
    return (
      <div className="welcome">
        <div className="button">
          <Link className="button_style" to="login"> Login </Link>
          <Link className="button_style" to="create_account"> Create Account </Link>
        </div>
      </div>
    )
  }
}

export default Welcome;
