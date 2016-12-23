import React, { Component } from 'react';
import Header from './header';

class AppHeader extends Component {
  // componentWillMount() {
  //   axios({
  //     method: 'post',
  //     url: 'http://localhost:8080/checklogin',
  //   }).then(({data}) => {
  //     console.log(data);
  //     if (data.status === true)
  //     {
  //       console.log("ok logged-in");
  //       // browserHistory.push('/matcha/profile');        
  //     }
  //     else{
  //       console.log('user not logged in:', data.details);
  //       browserHistory.push('/');
  //     }
  //   })
  // }

  render() {

    return (
      <div>
        <Header />
          <div>
          {this.props.children}
          </div>
      </div>
    );
  }
}

export default AppHeader;
