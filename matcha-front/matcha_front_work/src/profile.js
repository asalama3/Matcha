import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

class Profile extends Component {

componentWillMount(){
  axios({
    method: 'post',
    url: 'http://localhost:8080/profile',
  }).then(({data}) => {
    console.log(data);
    // var test = 'true';
    if (data.status === true)
    {
      console.log("ok");
    }
    else{
      // test = 'false';
      // console.log('test', test);
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