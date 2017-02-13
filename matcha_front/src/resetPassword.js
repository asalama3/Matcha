import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

class resetPassword extends React.Component {
  state={
    error: '',
    err: 'err',
  }

  resetPassword = async (e) => {
    e.preventDefault();
    console.log(e.target.key.value);
    console.log(e.target.password.value);
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/reset_password',
      data: {
        username: e.target.username.value,
        key: e.target.key.value,
        password: e.target.password.value,
      },
    });
    if (response.data.status === true) {
      this.setState({ error: response.data.details });
      this.setState({ err: 'status' });
      setTimeout(() => {
					browserHistory.push('/');
				}, 2000);
      console.log(response.data.details);
    } else {
      this.setState({ error: response.data.details });
      console.log(response.data.details);
    }
  }

  render(){
    return(
      <div className="forgot">
      <div className="titleForgot">RESET YOUR PASSWORD </div>
        <form className="formPass" onSubmit={this.resetPassword}>
          <input className="forgotInput"
          type="text"
          name="username"
          placeholder="username"
          />
          <input className="forgotInput"
          type="text"
          name="key"
          placeholder="Please enter key"
          />
          <input className="forgotInput"
          type="password"
          name="password"
          placeholder="Please enter new password"
          />
          <input className="forgotSubmit"
          type="submit"
          name="submit"
          value="Change Password"
          />
        </form>
        <div className={this.state.err}>{this.state.error}</div>
      </div>
    )
  }
}

export default resetPassword;
