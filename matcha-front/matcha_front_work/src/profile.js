import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import '../css/profile.css';

class Profile extends Component {

state = {
  user: '',
  address: null,
  photo: [],
}

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/checklogin',
  }).then(({data}) => {
    const loggedUser = data.data;
    console.log('loggedUSERRRRRRR' , loggedUser);
    // if (data.status === true)
    // {
    //   this.setState({user: data.data, photo: data.data.photo});
    //   if (data.data.location !== null)
    //   {
    //     console.log("address non null");
    //   this.setState({address: data.data.location.address});
    //   }


    //   // console.log(this.state.user);
    //   // console.log(this.state.address);
    //   // console.log(this.state.user.photo);
    //   // console.log(this.state.photo);
    // }
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
}


componentWillReceiveProps = async(newProps) => {
  this.setState({photo: []});
  // console.log('yo' , newProps.params);
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

render(){

    // console.log('props' , this.props);
    const user = this.props.params.user;
    // console.log("You searched : " + user);

var style = {
  width: 200,
  height: 300,
}
  let profile =[];
  if (this.state.photo !== null && this.state.photo.length > 0) {
    console.log(this.state.photo.length);
    profile = this.state.photo.map((el, key) =>
        <img key={key} role="presentation" id="img-profile" className="img-thumbnail img-center img-rounded" src={`http://localhost:8080/public/${this.state.user.username}/${el.name}`} style={style} />
      );
  }

  return (
    <div>
      <h1>PROFILE</h1>
 <div className="container">
        <div className="col-sm-12">
          <div className="col-sm-3 margin-img">
          {this.state.photo.length > 0 && profile}
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
