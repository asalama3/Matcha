import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory, Link } from 'react-router';
import '../css/welcome.css';

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
    console.log('dscdscd');
    this.setState({ error: response.data.details });
    if (response.data.status === true) {
      console.log(response.data.details);
      localStorage.setItem('token', response.headers['x-access-token']);
      browserHistory.push('/matcha/profile');
    }
  }
  // click = (e) => {
  //   this.setState({test: '2'})
  // };
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

          // <Input.InputTest
          //   type="text"
          //   name="test"
          //   value="test"
          //   andrea={this.state.test}
          // />
          // <button onClick={this.click} />
    );
  }
}

export default Login;
