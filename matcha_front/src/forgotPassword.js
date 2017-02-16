import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import '../css/forgotPassword.css';

class forgotPassword extends React.Component {
  state={
    error: '',
    status: '',
    err: 'err',
  }

  // hideError = (error) => {
    // return this.setState({ err: 'hidden_error' });
  // }

  forgotPassword = async (e) => {
    e.preventDefault();
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/forgot_password',
      data: {
        email: e.target.email.value,
      },
    });
    if (response.data.status === true) {
      this.setState({ error: response.data.details });
      this.setState({ err: 'status' });

      // this.setState({ err: 'hidden_error' });
      setTimeout(() => {
					browserHistory.push('/resetPassword');
				}, 2000);
    } else {
      this.setState({ error: response.data.details });
      // setTimeout(this.hideError(response.data.details), 2000);
    }
  }

  render(){
    return(
      <div className="forgot">
      <div className="titleForgot">FORGOT YOUR PASSWORD ? </div>
        <form className="formPass" onSubmit={this.forgotPassword}>
          <input className="forgotInput"
          type="email"
          name="email"
          placeholder="Please enter your email"
          />
          <input className="forgotSubmit"
          type="submit"
          name="submit"
          value="Reset Password"
          />
        </form>
        <div className={this.state.err}>{this.state.error}</div>
      </div>
    )
  }
}

export default forgotPassword;
