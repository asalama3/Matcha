import React, {Component} from 'react';
import '../css/create_account.css';
import axios from 'axios';
export default class CreateUser extends Component{

  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:8080/createaccount',
    }).then(({data}) => {
      console.log(data);
    })
  }
  constructor(props) {
    super(props);
    this.state = {
      username : "andrea"
    }
  }

  create = async (e) => {
    e.preventDefault(); // no reload
    const response =  await axios({
      method: 'post',
      url: 'http://localhost:8080/createaccount',
      data: {
        username: e.target.username.value,
        password: e.target.password.value,
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
        email: e.target.email.value,
      }
    })
    // console.log(response.status);
  }

  render() {
    return (
      <div>
      <h1>CREATE ACCOUNT</h1>
        <form onSubmit={this.create}>
          <label className="create_acount"> Username </label>
          <input
          name="username"
          type="text"
          value={this.state.username}
          onChange={(event) => this.setState({username: event.target.value})}
          />
          <label className="create_account"> Firstname </label>
          <input
          name="firstname"
          type="text"
          />
          <label className="create_account"> Lastname </label>
          <input
          name="lastname"
          type="text"
          />
          <label className="create_account">Email</label>
          <input
          name="email"
          type="text"
          />
          <label className="create_account">Password</label>
          <input
          name="password"
          type="password"
          />
          <input
          name="submit"
          type="submit"
          />
        </form>
      </div>
    );
  }
}
