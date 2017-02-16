import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory, Link } from 'react-router';
import '../css/welcome.css';
var _ = require('lodash');

class Login extends Component {

  state = {
    error: '',
    test: '1',
  }

  login = async (e) => {
    e.preventDefault();
    if (e.target.username.value.length > 30) {
      e.target.username.value = '';
    }
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/login',
      data: {
        username: e.target.username.value,
        password: e.target.password.value,
      },
    });
    if (response.data.status === false) {
      this.setState({ error: response.data.details });
    } else if (response.data.status === true) {
      localStorage.setItem('token', response.headers['x-access-token']);
      if (!_.isEmpty(response.data.details.photo)) {
        browserHistory.push('/matcha/profile');
      } else {
        browserHistory.push('/matcha/editPictures');
      }
    }
  }
  render() {
    return (
      <div>
          <form onSubmit={this.login}>
            <label className="login"> Username </label>
              <input className="login_input"
              name="username"
              type="text"
              />
            <label className="login"> Password </label>
              <input className="login_input"
              name="password"
              type="password"
              />
              <input className="login_button"
              name="submit"
              type="submit"
              value="LOGIN"
              />
          </form>
          <Link to="/forgotPassword" className="forgotPass">Forgot Password ? </Link>
          <div className="error"> {this.state.error} </div>
      </div>
    );
  }
}

export default Login;
