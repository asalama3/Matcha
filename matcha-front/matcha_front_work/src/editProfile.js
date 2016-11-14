import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { Button, ButtonGroup, Input} from 'react-bootstrap/lib/';
import {Map, google, GoogleMap, Marker, InfoWindow} from 'google-maps-react';
import Geosuggest from 'react-geosuggest';
import Autocomplete from 'react-google-autocomplete';
import '../css/editProfile.css';
import TagsInput from 'react-tagsinput'



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
state = {
  address: null,
  position: {lat: 48.89668, lng: 2.31838},
  tags: []
}

setAddress = async (e) => {
  console.log(e.label);
  const google = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.label}`);
  if (google.data.status === 'OK')
  {
    console.log("ok");
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



render(){
  return(
    
    <div className="EditProfile">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
 <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>
     <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDADbx0qAGlxGF0VHatbFCgvQTKjOOZSGc&libraries=places"></script>

      <div>
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
          <div>
        <label className="birthday"> Birthday </label>
          
          <input type="number" min={0} max={31} name="Day" placeholder="Day" />
          <select name="month" >
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
          <input type="number" min={1940} max={2016} name="Year" placeholder="Year" />
          
          </div>
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
<div>
        <label className="tags"> Hobbies </label>

<TagsInput value={this.state.tags} onChange={this.handleChange} />
     </div>
            <label className="locate"> Location </label>

         <Geosuggest
         onSuggestSelect={this.setAddress}
						placeholder="Enter Your Address!"
					/>
              
<Map google={window.google} >
<Marker
      name={'Pos'}
    position={{lat: this.state.position.lat, lng:this.state.position.lng}} />
  </Map>
    </form>
    </div>
   
    </div>
   
    



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
