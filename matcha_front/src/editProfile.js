import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Geosuggest from 'react-geosuggest';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import '../css/editProfile.css';

import MatchInputRad    from './components/MatchInputRad'

class editProfile extends Component {

  state = {
    error: '',
    address: '',
    position: {},
    google: '',
    firstname: '',
    lastname: '',
    email: '',
    day: '',
    month: '',
    year: '',
    gender: '',
    orientation: '',
    bio: '',
    pending: true,
    tags: [],
  }

  componentDidMount = async() => {
    const fillData = await axios.get('http://localhost:8080/fill_data', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (fillData.data.status === true) {
      this.autofill();
    } else {
      browserHistory.push('/');
    }
  };

  setAddress = async (e) => {
    const google = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.label}`);
    if (google.data.status === 'OK') {
      const lat = google.data.results[0].geometry.location.lat;
      const lng = google.data.results[0].geometry.location.lng;
    this.setState({ position: { lat, lng, address: e.label } });
    }
  };

  handleChange = (tags) => {
    this.setState({ tags });
  }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({ [e.target.name]: text });
  }

  autofill = async () => {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/autoFill',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.data.user) {
      this.setState({
        firstname: response.data.user.firstname,
        lastname: response.data.user.lastname,
        email: response.data.user.email,
        day: response.data.user.day,
        month: response.data.user.month,
        year: response.data.user.year,
        gender: response.data.user.gender,
        orientation: response.data.user.orientation,
        bio: response.data.user.bio,
        tags: response.data.user.hobbies,
        pending: false,
      });
      if (response.data.user.location.address) {
        this.setState({ address: response.data.user.location.address,
        position: { address: response.data.user.location.address, lat: response.data.user.location.lat, lng: response.data.user.location.lng } });
      }
    }
  };


  editProfile = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, bio } = e.target;
    if (firstname.value.length > 20) return this.setState({ error: 'firstname too long' });
    if (lastname.value.length > 20) return this.setState({ error: 'lastname too long' });
    if (email.value.length > 30) return this.setState({ error: 'email too long' });
    if (bio.value.length > 1500) return this.setState({ error: 'bio cannot exceed 1500 characters' });
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/editProfile',
      data: {
       firstname: e.target.firstname.value,
       lastname: e.target.lastname.value,
       email: e.target.email.value,
       day: e.target.day.value,
       month: e.target.month.value,
       year: e.target.year.value,
       gender: e.target.gender.value,
       orientation: e.target.orientation.value,
       bio: e.target.bio.value,
       hobbies: this.state.tags,
       location: this.state.position,
     },
     headers: {
       Authorization: `Bearer ${localStorage.getItem('token')}`
     },
    });
    if (response.data.status === true) {
      browserHistory.push('/matcha/profile');
    } else {
      console.log(response);
      this.setState({ error: response.data.details })
    }
  }

  getGender = (e) => {
    this.setState({ gender: e.target.value });
  }

  getOrientation = (e) => {
    this.setState({ orientation: e.target.value });
  }

  render() {
    const options = [];
      for (let i = 1; i < 32; i += 1) {
        options.push(<option key={i}> {i} </option>);
      }
    const year = [];
      for (let i = 1920; i < 2000; i += 1) {
        year.push(<option key={i}> {i} </option>);
      }
    const tags = [];
    const { pending } = this.state;
    return (
      <div className="editProfile">
        <form className="form" onSubmit={this.editProfile} >
          <h2 className="titleProfile"> Edit/Complete Your Profile </h2>
            <label className="inputForm" > Firstname </label>
            <input required onChange={this.onChange}
              name="firstname"
              type="text"
              value={this.state.firstname}
              className="displayInput"
            />
            <label className="inputForm" > Lastname </label>
            <input required onChange={this.onChange}
              name="lastname"
              type="text"
              value={this.state.lastname}
              className="displayInput"
            />
            <label className="inputForm" > Email </label>
            <input required onChange={this.onChange}
              name="email"
              type="email"
              value={this.state.email}
              className="displayInput"
            />
            <div className="anniv">
              <div><label className="inputForm"> Birthday </label></div>
              <select className="birthdates" name="day" value={this.state.day} onChange={this.onChange}> options={options} </select>
              <select className="birthdates" name="month" value={this.state.month} onChange={this.onChange} >
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
              <select className="birthdates" name="year" value={this.state.year} onChange={this.onChange}> options={year} </select>
            </div>
            <label className="inputForm" > Gender </label>
            <MatchInputRad labelClassName="sex" name="gender" required={true} value="male" checked={this.state.gender === 'male'} id="r1" content="Male" onClick={this.getGender}/>
            <MatchInputRad labelClassName="sex" name="gender" value="female" checked={this.state.gender === 'female'} id="r2" content="Female" onClick={this.getGender}/>
            <label className="inputForm"> Sexual Orientation </label>
            <MatchInputRad labelClassName="or" name="orientation" value="straight" checked={this.state.orientation === 'straight'} id="r3" content="Straight" onClick={this.getOrientation} />
            <MatchInputRad labelClassName="or" name="orientation" value="bisexual" checked={this.state.orientation === 'bisexual'} id="r4" content="Bisexual" onClick={this.getOrientation} />
            <MatchInputRad labelClassName="or" name="orientation" value="gay" checked={this.state.orientation === 'gay'} id="r5" content="Gay" onClick={this.getOrientation} />
            <div>
              <label className="inputForm"> Biography (optional) </label>
              <br/>
              <textarea className="bio" type="text" name="bio" value={this.state.bio} onChange={this.onChange}></textarea>
            </div>
            <div>
              <label className="inputForm"> Hobbies (optional) </label>
              {this.state.tags ?
                (<TagsInput className="hobbies" value={this.state.tags} name="tags" onChange={this.handleChange} />)
                  :
                (<TagsInput className="hobbies" value={tags} name="tags" onChange={this.handleChange} />)
              }
            </div>
            <label className="inputForm"> Location (optional) </label>
              {!pending && <Geosuggest
                onSuggestSelect={this.setAddress}
                placeholder="Enter Your Address!"
                initialValue={this.state.address}
                // value={this.state.address}
              />}
            <input id="submit" type="submit" value="Submit" name="submit" className="displayInput"/>
        </form>
        <div className="erreur"> {this.state.error} </div>
    </div>);
  }
}

export default editProfile;
