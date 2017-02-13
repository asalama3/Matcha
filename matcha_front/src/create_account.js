import axios from 'axios';
import React, { Component } from 'react';
import '../css/welcome.css';

export default class CreateUser extends Component {

  state = {
    test: 'andrea',
    error: '',
    success: '',
    login: 'hidden_login_form',
    create: 'hidden_create_form',
    position: {},
  }

  _timeout = null;

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  createAccount = async (e) => {
    e.persist(); // long request - converve valeurs de l'evenement
    e.preventDefault(); // no reload

    this.setState({ error: '', success: '' });
    const ip = await axios.get('http://ip-api.com/json');
    console.log(ip.data);
    // let location = null;
    // console.log(ip.data.status);
    if (ip.data.status === 'success') {
      this.setState({ position: {
        lat: ip.data.lat,
        lng: ip.data.lon,
        address: '',
        },
      });
    }

    if (e.target.firstname.value.length > 30 || e.target.lastname.value.length > 30 || e.target.email.value.length > 30 || e.target.password.value.length > 30) {
      e.target.firstname.value = '';
      e.target.lastname.value = '';
      e.target.email.value = '';
      e.target.password.value = '';
    }
    // console.log(this.state.position);

    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/create_account',
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
        position: this.state.position,
      },
    });
    if (response.data.status === false) {
      this.setState({ error: response.data.details });
    }
    else if (response.data.status === true) {
      this.setState({ success: 'success ! you can now login !' });
      this._timeout = setTimeout(() => {
        this.setState({ create: 'hidden_create_form', login: 'login_form_active' });
      }, 2000);
    }
  }

  render() {
    const options = [];
    for (let i = 1; i < 32; i++) {
      options.push(<option key={i}> {i} </option>);
    }
    const year = [];
    for (let i = 1920; i < 2000; i++) {
      year.push(<option key={i}> {i} </option>);
    }

    return (
      <div>
        <form onSubmit={this.createAccount}>
          <div className="register">
            <div>
              <label className="create"> Username </label>
              <input className="create_input"
                required
                name="username"
                type="text"
                // value={this.state.username}
                // onChange={(event) => this.setState({username: event.target.value})}
              />
            </div>
            <div>{this.state.userError}
              <label className="create"> Firstname </label>
              <input className="create_input"
                required
                name="firstname"
                type="text"
              />
              <label className="create"> Lastname </label>
              <input className="create_input"
                required
                name="lastname"
                type="text"
              />
              <label className="create">Email</label>
              <input className="create_input"
                required
                name="email"
                type="email"
              />
              <label className="create">Password</label>
              <input className="create_input"
                required
                name="password"
                type="password"
              />
              <hr/>
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
            <hr/>
            <div><label className="create"> Gender </label></div>
            <div className="style_radio">
              <div className="style_radio">
                <input className="radio" id="r1" type="radio" value="male" name="gender" required />
                <label id="male_sex" htmlFor="r1">Male</label>
              </div>
              <div className="style_radio">
                <input className="radio" id="r2" type="radio" value="female" name="gender" />
                <label id="female_sex" htmlFor="r2">Female</label>
              </div>
            </div>
            <div>
              <div><label className="create"> Sexual Orientation </label></div>
              <div className="style_radio">
                <div className="style_radio">
                  <input className="radio" id="r3" type="radio" value="straight" name="orientation" />
                  <label id="straight" htmlFor="r3">Straight</label>
                </div>
                <div className="style_radio">
                  <input className="radio" id="r4" type="radio" value="bisexual" name="orientation" />
                  <label id="bi" htmlFor="r4">Bisexual</label>
                </div>
                <div className="style_radio">
                  <input className="radio" id="r5" type="radio" value="gay" name="orientation" />
                  <label id="gay" htmlFor="r5">Gay</label>
                </div>
              </div>
            </div>
            <input className="register_button"
              name="submit"
              type="submit"
              value="register"
            />
          </div>
        </form>
        {(this.state.error && <div className="error" > {this.state.error} </div>) ||
        (this.state.success && <div className="success" > {this.state.success} </div>)}
    </div>
    );
  }
}
