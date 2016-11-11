import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { Button, ButtonGroup, Input} from 'react-bootstrap/lib/';
import GoogleMap from 'google-map-react';


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

static defaultProps = {
    center: {lat: 59.938043, lng: 30.337157},
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
};

  constructor(props) {
    super(props);
  }

render(){
  return(
    <div className="EditProfile">
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
                <GoogleMap
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}>
        <MyGreatPlace lat={59.955413} lng={30.337844} text={'A'} /* Kreyser Avrora */ />
        <MyGreatPlace {...this.props.greatPlaceCoords} text={'B'} /* road circle */ />
      </GoogleMap>
            
        
        
        </form>
    </div>
  )
  }
}

export default editProfile;
