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
    login: 'hidden_login_form',
    create: 'hidden_create_form',
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
    console.log(response.data.details);
    this.setState({ error: response.data.details });
    console.log(response.data.details);
    if (response.data.status === true)
    {
      console.log("ok login");
      browserHistory.push('/');
      this.setState({ error: 'you can now login' });

      // this.setState({ create: 'hidden_create_form'});
      // this.setState({ login: 'login_form_active' });

      // activer login active form et desacter create form active
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
        <form onSubmit={this.createAccount}>
          <label className="create"> Username </label>
          <input
          // required
          name="username"
          type="text"
          // value={this.state.username}
          // onChange={(event) => this.setState({username: event.target.value})}
          />
          <div>{this.state.userError}
          <label className="create"> Firstname </label>
          <input
          // required
          name="firstname"
          type="text"
          />
          <label className="create"> Lastname </label>
          <input
          // required
          name="lastname"
          type="text"
          />
          <label className="create">Email</label>
          <input
          // required
          name="email"
          type="email"
          />
          <label className="create">Password</label>
          <input
          // required
          name="password"
          type="password"
          />
          <div>
            <label className="create"> Birthday </label>
              <div className="birthdate">
              <select name="day" className="birth">
                <option> Day </option>
                  options={options}
              </select>
                <select className="birth" name="month" value={this.state.month} onChange={this.onChange} >
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
              <select className="birth" name="year">
                <option> Year </option>
                  options={year}
              </select>
              </div>
        </div>
          <label className="create"> Gender </label>
          <div className="radio_centered">
            <input className="radio" id="r1" type="radio" value="male" name="gender" required   />
              <label className="gender" htmlFor="r1">Male</label>
            <input  className="radio" id="r2" type="radio" value="female" name="gender"  />
              <label className="gender" htmlFor="r2">Female</label>

          </div>
          <div>
          <label className="create"> Sexual Orientation </label>
          <div className="radio_centered">
              <input className="radio" id="r3" type="radio" value="straight" name="orientation"  />
              <label className="orientation" htmlFor="r3">Straight</label>
              <input  className="radio" id="r4" type="radio" value="bisexual" name="orientation" />
              <label className="orientation" htmlFor="r4">Bisexual</label>
              <input className="radio" id="r5" type="radio" value="gay" name="orientation" />
              <label className="orientation" htmlFor="r5">Gay</label>
          </div>
          </div>
          <input className="register_button"
          name="submit"
          type="submit"
          value="register"
          />
          </div>
        </form>
        {/* <div onClick={this.test1} onDoubleClick={this.test2}> {this.state.test} </div> */}
        <div> {this.state.error} </div>
    </div>
    );
  }
}
