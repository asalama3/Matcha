import React from 'react';
import { Link } from 'react-router';
import '../css/welcome.css';
import Login from './login';
import CreateUser from './create_account';


class Welcome extends React.Component {
  state = {
    test: 'test',
    try: 'try',
  }
  click1 = (e) => {
    if (this.state.test = 'test')
    this.setState({ test: 'test1' });
    else if (this.state.test = 'test1')
    this.setState({ test: 'test'});
  }

  clickb = (e) => {
    if (this.state.try = 'try')
    this.setState({ try: 'try1' });
    else if (this.state.try = 'try1')
    this.setState({ try: 'try'});
  }

  render() {
    return (
      <div className="welcome">
      <link href="https://fonts.googleapis.com/css?family=Cookie|Cormorant+Upright|Playball|Shadows+Into+Light+Two|Tangerine" rel="stylesheet"/>

        <div className="button">
        <p> MATCHA </p>
        <button onClick={this.click1}> TEST </button> 
        <button onClick={this.clickb}> TRY </button> 
        
          <Link className="button_style" to="login"> Login </Link>
          <Link className="button_style" to="create_account"> Create Account </Link>
          <div className={this.state.test} > <Login /> </div>
          <div className={this.state.try} > <CreateUser /> </div>
        
        </div>
      </div>
    )
  }
}

export default Welcome;
