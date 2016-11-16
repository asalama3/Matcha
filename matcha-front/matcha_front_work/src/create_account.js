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

  state = {
    test: 'andrea',
    error: '',
    gender: '',
    orientation: '',
  }

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
        gender: e.target.gender.value,
        orientation: e.target.orientation.value,

      }
    })
    this.setState({ error: response.data.details });
    console.log(response.data.details);
    if (response.data.status === true)
    {
      console.log("ok login");
      browserHistory.push('/login');
    }
  }

getgender = (e) =>{
  this.setState({gender: e.target.value});
  console.log(e.target.value);
  // console.log("gender state: " + this.state.gender);
  
}

orientation = (e) => {
  this.setState({orientation: e.target.value})
  console.log(e.target.value);
  // console.log("orientation state: " + this.state.orientation);
}

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
          <label className="create_account"> Gender </label>
            <input type="radio" value="male" name="gender" required checked={this.state.gender === "male"} onClick={this.getgender} /> Male
            <input type="radio" value="female" name="gender" checked={this.state.gender === "female"} onClick={this.getgender} /> Female
            <input type="radio" value="other" name="gender" checked={this.state.gender === "other"} onClick={this.getgender}/> Other
          <label className="orientation"> Sexual Orientation </label>
              <input type="radio" value="straight" name="orientation" required checked={this.state.orientation === "straight"} onClick={this.orientation}/> Straight
              <input type="radio" value="bisexual" name="orientation" checked={this.state.orientation === "bisexual"} onClick={this.orientation}/> Bisexual
              <input type="radio" value="gay" name="orientation" checked={this.state.orientation === "gay"} onClick={this.orientation}/> Gay
              <input type="radio" value="other" name="orientation" checked={this.state.orientation === "other"} onClick={this.orientation}/> Other
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
