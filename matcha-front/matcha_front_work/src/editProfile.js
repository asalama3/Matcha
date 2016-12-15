import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
// import {Map, google, GoogleMap, Marker, InfoWindow} from 'google-maps-react';
import Geosuggest from 'react-geosuggest';
// import Autocomplete from 'react-google-autocomplete';
import '../css/editProfile.css';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.



class editProfile extends Component{

state = {
  error: '',
  address: null,
  position: {},
  google: null,
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
}

  constructor() {
    super()
    this.state = {tags: []}
  }

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/checklogin',
  }).then(({data}) => {
    console.log(data);
    // var test = 'true';
    if (data.status === true)
    {
      console.log("ok");
      this.autofill();
    }
    else{
      // test = 'false';
      // console.log('test', test);
      console.log('user not logged in:', data.details);
      browserHistory.push('/');
    }
  })
}

setAddress = async (e) => {
  console.log(e.label);
  const google = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.label}`);
  if (google.data.status === 'OK')
  {
    // console.log(google.data)
    const lat = google.data.results[0].geometry.location.lat;
    const lng = google.data.results[0].geometry.location.lng;
    // console.log (lat, lng);
    // console.log(e.label);
    this.setState({position: {lat: lat, lng: lng, address: e.label}} );
    console.log(this.state.position);
    }
  };

  // this.setState({ address: e.label });

handleChange = (tags) => {
    this.setState({tags})
  console.log("hobbies" , this.state.tags);
}

onChange = (e) =>{
  const text = e.target.value;
  this.setState({[e.target.name]: text})
}

autofill = async (e) => {
  const response = await axios({
    method: 'post',
    url: 'http://localhost:8080/autoFill',
  })
  console.log(response.data.user);
  if (response.data.user){
    console.log("coucou");
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
    })
    console.log(this.state.gender);
  if (response.data.user.location)
  {
    console.log("address non null");
    this.setState({address: response.data.user.location.address}) ;

  }
}
};


 editProfile = async (e) => {
    e.preventDefault(); // no reload
  console.log("editProfil");
  // console.log("sans value: " , e.target.firstname);
  // console.log(e.target.firstname.value);
   if (e.target.firstname.value.length > 30 || e.target.lastname.value.length > 30 || e.target.email.value.length > 30
   || e.target.bio.value.length > 300)
    {
      this.setState({error: "cannot exceed 30 characters"});
      console.log("entered in over 30 chars");
      return ;
      // e.target.firstname.value = '';
      // e.target.lastname.value = '';
      // e.target.email.value= '';
      // e.target.bio.value = '';
    }
    const response = await axios ({
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
   }
    })
      if (response.data.status === true)
    {

      console.log("ok edit pro");
      browserHistory.push('/matcha/profile');
    }
 }


getGender = (e) =>{
  this.setState({gender: e.target.value});
}

getOrientation = (e) =>{
  console.log(e.target.value);
  this.setState({orientation: e.target.value});
}

render(){
  let options = [];
    for (let i=1; i < 32; i++){
      options.push(<option key={i}> {i} </option>)
    }
    let year = [];
    for (let i=1920; i < 2000; i++){
      year.push(<option key={i}> {i} </option>)
    }
    const tags = [];
    const { pending } = this.state
  return(
    <div className="editProfile">
      <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDADbx0qAGlxGF0VHatbFCgvQTKjOOZSGc&libraries=places"></script>

          <form className="form" onSubmit={this.editProfile} >
          <h2> Edit Your Profile </h2>

            <label className="inputForm" > Firstname </label>
            <input required onChange={this.onChange}
              name="firstname"
              type="text"
              value={this.state.firstname}
            />
            <label className="inputForm" > Lastname </label>
            <input required onChange={this.onChange}
              name="lastname"
              type="text"
              value={this.state.lastname}
            />
            <label className="inputForm" > Email </label>
            <input required onChange={this.onChange}
              name="email"
              type="email"
              value={this.state.email}
            />
            <div>
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

          <div><label className="inputForm" > Gender </label></div>
            <div className="style">
              <div className="style">              
                <input className="radio" type="radio" id="r1" name="gender" required value="male" checked={this.state.gender === "male"} onClick={this.getGender}/>
                <label className="sex" htmlFor="r1">Male</label>
              </div>
            </div>
            <div className="style">
              <div className="style">             
                <input className="radio" type="radio" id="r2" name="gender" value="female" checked={this.state.gender === "female"} onClick={this.getGender}/>
                <label className="sex" htmlFor="r2">Female</label>
              <div>
            </div>
          </div>
          <label className="inputForm"> Sexual Orientation </label>
            <div className="style">
              <div className="style">
                <input className="radio" type="radio" id="r3" value="straight" name="orientation" required checked={this.state.orientation === "straight"} onClick={this.getOrientation}/>
                  <label className="or" htmlFor="r3">Straight</label>
              </div>
            </div>
            <div className="style">
              <div className="style">
                <input className="radio" type="radio" id="r4" value="bisexual" name="orientation" checked={this.state.orientation === "bisexual"} onClick={this.getOrientation}/>
                <label className="or" htmlFor="r4">Bisexual</label>
              </div>
            </div>
            <div className="style">
              <div className="style">
                <input className="radio" type="radio" id="r5" value="gay" name="orientation" checked={this.state.orientation === "gay"} onClick={this.getOrientation}/>
                <label className="or" htmlFor="r5">Gay</label>
              </div>
            </div>
          </div>
          <div>
            <label className="inputForm"> Biography (optional) </label>
              <input className="bio" type="text" name="bio" value={this.state.bio} onChange={this.onChange}/>
          </div>
          <div>
            <label className="inputForm"> Hobbies (optional) </label>
            {this.state.tags ? (<TagsInput className="hobbies" value={this.state.tags} name="tags" onChange={this.handleChange} />) : (<TagsInput className="hobbies" value={tags} name="tags" onChange={this.handleChange} />)}
          </div>
            <label className="inputForm"> Location (optional) </label>
              {!pending && <Geosuggest
                onSuggestSelect={this.setAddress}
						    placeholder="Enter Your Address!"
                initialValue={this.state.address}
                // value={this.state.address}
              />}
            <input id="submit" type="submit" value="Submit" name="submit"  />
        </form>
        <div> {this.state.error} </div>
    </div>
  )}
}

export default editProfile;
