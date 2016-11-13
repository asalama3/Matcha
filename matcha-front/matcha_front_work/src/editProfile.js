import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { Button, ButtonGroup, Input} from 'react-bootstrap/lib/';
import {maps, google, GoogleMap} from 'google-map-react';
import Geosuggest from 'react-geosuggest';
import Autocomplete from 'react-google-autocomplete';
import '../css/editProfile.css';


class editProfile extends Component{
// render() {
//   return (
//     <div>
//     <h1>helloooo </h1>
//   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
//   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
// <ButtonGroup>
//       <Button active>Radio 1
//         <Input ref="input1" type="radio" name="radioButtonSet" value='input1' standalone defaultChecked/>
//       </Button>
//       <Button>Radio 2
//         <Input ref="input2" type="radio" name="radioButtonSet" value='input2' standalone/>
//       </Button>
//     </ButtonGroup>
//   </div>
//   )};
// }

// editProfile = async(e) => {
//   e.preventDefault();
// }

render(){
  return(
    
    <div className="EditProfile">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
 <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>
     <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDADbx0qAGlxGF0VHatbFCgvQTKjOOZSGc&libraries=places"></script>

      <h1> Edit Your Profile </h1>
        <form onSubmit={this.editProfile}>
          <label className="fname"> Firstname </label>
          <input
          name="firstname"
          type="text"
          />
          <label className="name"> Lastname </label>
          <input
          name="lastname"
          type="text"
          />
        <label className="email"> Email </label>
          <input
          name="email"
          type="email"
          />
        <label className="gender"> Gender </label>
          <input type="radio" value="MALE" name="gender"/> Male
          <input type="radio" value="FEMALE" name="gender"/> Female
          <input type="radio" value="OTHER" name="gender"/> Other
          <div>
            <label className="orientation"> Sexual Orientation </label>
              <input type="radio" value="straight" name="orientation"/> Straight
              <input type="radio" value="bisexual" name="orientation"/> Bisexual
              <input type="radio" value="gay" name="orientation"/> Gay
              <input type="radio" value="other" name="orientation"/> Other
          </div>
          <div>
            <label className="bio"> Biography </label>
              <input type="text" name="bio"/>
          </div>
            <label className="locate"> Location </label>
              <Autocomplete
                  style={{width: '90%'}}
                  onPlaceSelected={(place) => {
                  console.log(place);
                   }}
                  types={['(regions)']}
                />
        </form>
             
    </div>
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
