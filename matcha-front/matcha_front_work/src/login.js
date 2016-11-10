import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';


class Login extends Component {

state = {
  error: '',
}

login = async (e) => {
  e.preventDefault();
  const response = await axios({
    method: 'post',
    url: 'http://localhost:8080/login',
    data: {
      username: e.target.username.value,
      password: e.target.password.value,
    }
  })
  this.setState({error: response.data.details});
  console.log(response.data.details);
  if (response.data.status === true)
  {
    console.log("ok logged in")
    browserHistory.push('/matcha/profile');
  }
}

  render() {
    return (
      <div>
        <h1>LOGIN</h1>
          <form onSubmit={this.login}>
            <label className="login"> Username </label>
              <input
              name="username"
              type="text"
              />
            <label className="login"> Password </label>
              <input
              name="password"
              type="password"
              />
              <input
              name="subimit"
              type="submit"
              />
          </form>
          <div> {this.state.error} </div>
      </div>
    )
  }
}

export default Login;
