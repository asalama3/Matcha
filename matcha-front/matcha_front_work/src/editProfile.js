import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
// import { Button, ButtonGroup, Input} from 'react-bootstrap/lib/';
// import {Map, google, GoogleMap, Marker, InfoWindow} from 'google-maps-react';
import Geosuggest from 'react-geosuggest';
// import Autocomplete from 'react-google-autocomplete';
import '../css/editProfile.css';
import TagsInput from 'react-tagsinput';



class editProfile extends Component{

state = {
  address: null,
  position: {},
  tags: [],
  google: null,
  firstname: '',
  lastname: '',
  email: '',
  day: '',
  month: '',
  year: '',
  gender: '',
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
      browserHistory.push('/login');
    }
  })
}

setAddress = async (e) => {
  console.log(e.label);
  const google = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.label}`);
  if (google.data.status === 'OK')
  {
    console.log(google.data)
    const lat = google.data.results[0].geometry.location.lat;
    const lng = google.data.results[0].geometry.location.lng;
    console.log (lat, lng);
    this.setState({position: {lat: lat, lng: lng}} );
    console.log(this.state.position);
    }
  };
    
  // this.setState({ address: e.label });

handleChange = (tags) => {
    this.setState({tags})
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
  if (response.data.user){
    console.log("coucou");
    this.setState({firstname: response.data.user.firstname}) ;
    this.setState({lastname: response.data.user.lastname}) ;
    this.setState({email: response.data.user.email}) ;
  }
};


 editProfile = async (e) => {
    const response = await axios ({
   method: 'post',
   url: 'http://localhost:8080/editProfile',
   data: {
     firstname: e.target.firstname.value,
     lastname: e.target.lastname.value,
     email: e.target.email.value,
     gender: e.target.gender.value, 
     orientation: e.target.orientation.value, 
     bio: e.target.bio.value,
     hobbies: e.target.hobbies.value,
     location,
   }
    })
   if (response.data){
     console.log("heyyyyy");
   }
 }

render(){
  return(
    
    <div className="EditProfile">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDADbx0qAGlxGF0VHatbFCgvQTKjOOZSGc&libraries=places"></script>

      <div>
      <h1> Edit Your Profile </h1>
        <form onSubmit={this.editProfile} >
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
        <label className="birthday"> Birthday </label>
          
          <input type="number" min={0} max={31} name="day" placeholder="Day" required/>
          <select name="month" required value={this.state.month} onChange={this.onChange} >
          <option value="January">January </option>
          <option value="February">February </option>
          <option value="March">March </option>
          <option value="April">April </option>
          <option value="May">May </option>
          <option value="June">June </option>
          <option value="July">July </option>
          <option value="August">August </option>
          <option value="September">September </option>
          <option value="October">October </option>
          <option value="November">November </option>
          <option value="December">December </option>
          </select>
          <input type="number" min={1940} max={2016} name="year" placeholder="Year" required />
          
          </div>
        <label className="gender"  > Gender </label>
          <input type="radio" value="MALE" name="gender" required /> Male
          <input type="radio" value="FEMALE" name="gender" /> Female
          <input type="radio" value="OTHER" name="gender"/> Other
          <div>
            <label className="orientation"> Sexual Orientation </label>
              <input type="radio" value="straight" name="orientation" required/> Straight
              <input type="radio" value="bisexual" name="orientation"/> Bisexual
              <input type="radio" value="gay" name="orientation"/> Gay
              <input type="radio" value="other" name="orientation"/> Other
          </div>
          <div>
            <label className="bio"> Biography </label>
              <input type="text" name="bio"/>
          </div>
<div>
        <label className="tags"> Hobbies </label>

<TagsInput value={this.state.tags} onChange={this.handleChange} />
     </div>
            <label className="locate"> Location </label>

         <Geosuggest
         onSuggestSelect={this.setAddress}
						placeholder="Enter Your Address!"
					/>
              
<input type="submit" value="Submit"  />

    </form>
    </div>
   
    </div>
   
//    <Map 
//     google={window.google} 
//     style={{height: "50%", width: "80%"}}
//     zoom={14} 
// >
// <Marker
//     name={'Current Location'}
//     zoom={14}
//     position={{lat: this.state.position.lat, lng:this.state.position.lng}} />
//   </Map>


// <Autocomplete
              //     style={{width: '90%'}}
              //     onPlaceSelected={(place) => {
              //     console.log(place);
              //      }}
              //     types={['(regions)']}
              //   />
             
        // <GoogleMap
        //             containerProps={{style: {height: "100%"}}}
        //             ref="map"
        //             defaultZoom={3}
        //             defaultCenter={{lat: -25.363882, lng: 131.044922}}>

        //         </GoogleMap>

  )
  }
}

export default editProfile;
