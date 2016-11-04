import React, {Component} from 'react';
import '../css/create_account.css';
import axios from 'axios';
import { Router, Route, Link, browserHistory, IndexRoute} from 'react-router';


export default class CreateUser extends Component{

  // componentWillMount() {
  //   axios({
  //     method: 'post',
  //     url: 'http://localhost:8080/createaccount',
  //   }).then(({data}) => {
  //     console.log(data);
  //   })
  // }

  state = {
    test: 'andrea',
    error: '',
  }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     username : "andrea"
  //   }
  // }

  createAccount = async (e) => {
    e.preventDefault(); // no reload
    const response =  await axios({
      method: 'post',
      url: 'http://localhost:8080/createaccount',
      data: {
        username: e.target.username.value,
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
        email: e.target.email.value,
        password: e.target.password.value,
      }
    })
    this.setState({ error: response.data.details });
    console.log(response.data.details);
    if (response.data.status === true)
    {
      console.log("ok login");
      browserHistory.push('/login');
    }
    // redirect to login;
  }
  // test = (e) => {
  //   e.preventDefault();
  //   this.setState({ test: 'alban' });
  // }
  //
  // test1 = (e) => {
  //   e.preventDefault();
  //   this.setState({ test: 'youhoo' });
  // }
  //
  // test2 = (e) => {
  //   e.preventDefault();
  //   this.setState({ test: '' });
  // }
  render() {
    return (
      <div>
      <h1>CREATE ACCOUNT</h1>
        <form onSubmit={this.createAccount}>
          <label className="create_acount"> Username </label>
          <input
          // required
          name="username"
          type="text"
          value={this.state.username}
          onChange={(event) => this.setState({username: event.target.value})}
          />
          <div>{this.state.userError}
          <label className="create_account"> Firstname </label>
          <input
          // required
          name="firstname"
          type="text"
          />
          <label className="create_account"> Lastname </label>
          <input
          // required
          name="lastname"
          type="text"
          />
          <label className="create_account">Email</label>
          <input
          // required
          name="email"
          type="email"
          />
          <label className="create_account">Password</label>
          <input
          // required
          name="password"
          type="password"
          />
          <input
          name="submit"
          type="submit"
          />
          </div>
        </form>
        {/* <div onClick={this.test1} onDoubleClick={this.test2}> {this.state.test} </div> */}
        <div> {this.state.error} </div>
        </div>
    );
  }
}
