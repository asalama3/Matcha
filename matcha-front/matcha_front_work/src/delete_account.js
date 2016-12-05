import React, {Component} from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

class deleteAccount extends Component {
  componentWillMount(){
      axios({
          method: 'post',
          url: 'http://localhost:8080/deleteAccount',
      }).then(({data}) => {
          if (data.status === true)
          {
              // console.log("deleted account");
              browserHistory.push('/');
          }
      })
      }



  render(){
    return(
      <div></div>
    )
  }
}

export default deleteAccount;
