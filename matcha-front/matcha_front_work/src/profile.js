import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

class Profile extends Component {

state = {
  user: '',
  address: '',
  photo: [],
}

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/checklogin',
  }).then(({data}) => {
    console.log(data);
    if (data.status === true)
    {
      this.setState({user: data.data, address: data.data.location.address, photo: data.data.photo});
      // console.log(this.state.user);
      // console.log(this.state.address);
      // console.log(this.state.user.photo);
      console.log(this.state.photo);
    }
    else{
      console.log('user not logged in:', data.details);
      browserHistory.push('/login');
    }
  })
}

render(){
var style = {
  width: 200,
  height: 300,
}
  const profile = this.state.photo.map((el, key) =>
         <img key={0} src={`http://localhost:8080/public/${this.state.user.username}/${el.name}`} style={style} /> 
        
  );
  console.log(profile);
  return (
    <div>
      <h1>PROFILE</h1>
 <div className="container">
        <div className="col-sm-12">
          <div className="col-sm-3 margin-img">
              {profile}
          </div>
          <div className="col-sm-7 well margin-well">
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