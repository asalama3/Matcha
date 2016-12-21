import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import '../css/profile.css';
// import {React_Boostrap_Carousel, CarouselItem, Carousel} from 'react-boostrap-carousel';
// import {ReactCarousel} from 'react-carousel';
// var Carousel = require('react-responsive-carousel').Carousel;
// import {onChange, onClickItem, onClickThumb, showThumbs, showArrows, axis} from 'react-responsive-carousel';
var Slider = require('react-slick');
import Images from './images';

class Profile extends Component {

state = {
  user: '',
  address: null,
  photo: [],
  pending: true,
}

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/checklogin',
  }).then(({data}) => {
    const loggedUser = data.data;
    console.log('loggedUSERRRRRRR' , loggedUser);

    if (data.status === false) {
      console.log('user not logged in:', data.details);
      browserHistory.push('/');
    }
    console.log('props user' , this.props.params.user);
    if (this.props.params.user) {
      axios({
      method: 'post',
     url: 'http://localhost:8080/searchLogin',
     data:{
       username: this.props.params.user,
      }
    }).then(({data}) => {
      // Deal if the user doesn't exist
      // Redirect
      console.log('OK', data)
      this.setState({ user: data.data, photo: data.data.photo })
    })
    } else {
      this.setState({ user: loggedUser, photo: loggedUser.photo })
      if (loggedUser.location !== null)
      {
        this.setState({address: loggedUser.location.address});
      }
      console.log('USER LOGGED' , this.state.user);
    }
  })
  this.setState({pending: false});
}


componentWillReceiveProps = async(newProps) => {
  this.setState({photo: []});
  console.log('yo' , newProps.params);
  const response = await axios({
  method: 'post',
  url: 'http://localhost:8080/searchLogin',
  data:{
    username: newProps.params.user,
  }
});
this.setState({ user: response.data.data })
if (response.data.data.location !== null)
{
  this.setState({ address: response.data.data.location.address });
}else{
  this.setState({ address: '' });
}
if (response.data.data.photo.length > 0 )
{
  this.setState({ photo: response.data.data.photo });
}else{
  this.setState({ photo: [] });
}

}

like = () => {
  console.log('entered function like');
}

render(){
  const { pending } = this.state

var settings = {
  dots: true,
  infinite: true,
  // speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

    // console.log('props' , this.props);
    const user = this.props.params.user;
    console.log("You searched : " + user);
    
  return (
    <div>
      <h1>PROFILE</h1>
 <div className="container">
        <div className="col-sm-12">
          <div className="col-sm-3 margin-img">
          <Slider {...settings}>
            <div>
              {!pending && <Images photo={this.state.photo} user={this.state.user} />}
            </div>
          </Slider>
          </div>
          <div className="col-sm-7 well margin-well my_profile">
            <p>
              <i className="glyphicon glyphicon-user" /> {this.state.user.firstname}
              <br />
              <i className="glyphicon glyphicon-user" /> {this.state.user.lastname}
              <br />
              <i className="glyphicon glyphicon-user" /> {this.state.user.username}
              <br />
              <i className="glyphicon glyphicon-envelope" /> {this.state.user.email}
              <br />
              <i className="fa fa-birthday-cake" aria-hidden="true"></i> {this.state.user.age}
              <br />
              <i className="fa fa-neuter" aria-hidden="true"></i> {this.state.user.gender}
              <br />
              <i className="fa fa-heart" aria-hidden="true"></i> {this.state.user.orientation}
              <br />
            <i className="fa fa-comment-o" aria-hidden="true"></i> {this.state.user.bio}
              <br />
              <i className="fa fa-trophy" aria-hidden="true"></i>  {this.state.user.hobbies}
              <br />
            <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.address}
              <br />
              <i className="fa fa-heart fa-4x my_heart" aria-hidden="true" onClick={this.like}></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default Profile;

//  state = {
//     test: false,
//   }

// componentWillMount(){
//   axios({
//     method: 'post',
//     url: 'http://localhost:8080/profile',
//     data: {
//       username: "andddddrea",
//     }
//   }).then(({data}) => {
//     console.log(data);
//     if (data.status === true)
//     {
//       this.setState({ test: true });
//     }
//   })
// }

// render(){
//   return (
//     <div>
//       <h1>PROFILE</h1>
//       {this.state.test === true && <div> Bravo Andrea </div> || this.state.test === false && <div> Nul </div>}
//     </div>
//   );
// }
// }

// export default Profile;
