import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

class Profile extends Component {

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/profile',
  }).then(({data}) => {
    var test = 'true';
    if (data.status === true)
    {
      console.log("ok");
    }
    else{
      test = 'false';
      console.log('test', test);
      console.log('user not logged in:', data.details);
      // browserHistory.push('/login');

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
