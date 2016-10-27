import React from 'react';
import { Link } from 'react-router';
import '../css/welcome.css';


class Welcome extends React.Component {
  render() {
    return (
      <div className="welcome">
        <div className="button">
          <Link className="button1" to="login"> Login </Link>
          <Link className="button2" to="create_account"> Create Account </Link>
        </div>
      </div>
    )
  }
}

export default Welcome;
