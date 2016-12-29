import React from 'react';
import '../css/welcome.css';
import Login from './login';
import CreateUser from './create_account';

class Welcome extends React.Component {

  state = {
    login: 'hidden_login_form',
    create: 'hidden_create_form',
  }

  clicka = (e) => {
    if (this.state.create === 'create_form_active') {
      this.setState({ create: 'hidden_create_form' });
    }
    if (this.state.login === 'hidden_login_form') {
      console.log(this.state.login);
      this.setState({ login: 'login_form_active' });
    } else {
    this.setState({ login: 'hidden_login_form' });
    console.log(this.state.login);
    }
  }

  clickb = (e) => {
    if (this.state.login === 'login_form_active') {
      this.setState({ login: 'hidden_login_form' });
    }
    if (this.state.create === 'hidden_create_form') {
    this.setState({ create: 'create_form_active' });
    } else {
    this.setState({ create: 'hidden_create_form' });
    }
  }

  render() {
    return (
      <div className="welcome">
        <div>
          <p className="title"> MATCHA </p>
          <div className="intro"> From Scratch to Love </div>
          <div className="buttons">
            <button onClick={this.clicka} className="button_style"> Login </button>
            <button onClick={this.clickb}className="button_style"> Register </button>
          </div>
          <div className={this.state.login} > <Login /> </div>
          <div className={this.state.create} > <CreateUser /> </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
