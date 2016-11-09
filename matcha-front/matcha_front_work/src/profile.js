import React, {Component} from 'react';
import axios from 'axios';

class Profile extends Component {

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/profile',
  }).then(({data}) => {
    console.log(data);
    if (data.status === true)
    {
      console.log("ok");
    }
    else{
      console.log('svdsvsdv', data.details);
      // header -->login
    }
  })
}

render(){
  return (
    <div>
      <h1>PROFILE</h1>
    </div>
  );
}
}

export default Profile;
