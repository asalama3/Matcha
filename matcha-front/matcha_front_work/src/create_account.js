import React, {Component} from 'react';
import '../css/welcome.css';
import axios from 'axios';
import { Router, Route, Link, browserHistory, IndexRoute} from 'react-router';
import select from 'selection-range';

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
  }

  createAccount = async (e) => {
    e.preventDefault(); // no reload
    if (e.target.firstname.value.length > 30 || e.target.lastname.value.length > 30 || e.target.email.value.length > 30 || e.target.password.value.length > 30)
    {
      e.target.firstname.value = '';
      e.target.lastname.value = '';
      e.target.email.value= '';
      e.target.password.value = '';
    }


    const response =  await axios({
      method: 'post',
      url: 'http://localhost:8080/createaccount',
      data: {
        username: e.target.username.value,
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
        email: e.target.email.value,
        password: e.target.password.value,
        day: e.target.day.value,
        month: e.target.month.value,
        year: e.target.year.value,
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


  render() {
    let options = [];
    for (let i=1; i < 32; i++){
      options.push(<option> {i} </option>)
    }
    let year = [];
    for (let i=1920; i < 2000; i++){
      year.push(<option> {i} </option>)
    }
    
    return (
      <div>
      <h1>CREATE ACCOUNT</h1>
        <form onSubmit={this.createAccount}>
          <label className="create_acount"> Username </label>
          <input
          // required
          name="username"
          type="text"
          // value={this.state.username}
          // onChange={(event) => this.setState({username: event.target.value})}
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
          <div>
            <label className="birthday"> Birthday </label>
              <select name="day">
                <option> Day </option>
                  options={options} 
              </select>
                <select name="month" value={this.state.month} onChange={this.onChange} >
                  <option>Month</option>
                  <option value="01">January </option>
                  <option value="02">February </option>
                  <option value="03">March </option>
                  <option value="04">April </option>
                  <option value="05">May </option>
                  <option value="06">June </option>
                  <option value="07">July </option>
                  <option value="08">August </option>
                  <option value="09">September </option>
                  <option value="10">October </option>
                  <option value="11">November </option>
                  <option value="12">December </option>
                </select>
              <select name="year"> 
                <option> Year </option>
                  options={year} 
              </select>                
        </div>
          <label className="create_account"> Gender </label>
            <input type="radio" value="male" name="gender" required   /> Male
            <input type="radio" value="female" name="gender"  /> Female
            <input type="radio" value="other" name="gender"  /> Other
          <div>
          <label className="orientation"> Sexual Orientation </label>
              <input type="radio" value="straight" name="orientation"  /> Straight
              <input type="radio" value="bisexual" name="orientation" /> Bisexual
              <input type="radio" value="gay" name="orientation" /> Gay
              <input type="radio" value="other" name="orientation" /> Other
          </div>
          <input
          name="submit"
          type="submit"
          />
          </div>
        </form>
        {/* <div onClick={this.test1} onDoubleClick={this.test2}> {this.state.test} </div> */}
        <div> {this.state.error} </div>
        <p> Already a member?
          <Link className="button2" to="login"> Login </Link>
        </p>
        </div>
    );
  }
}
