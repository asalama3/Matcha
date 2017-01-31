import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

class Chat extends React.Component {

  state = {
    user: '',
    pending: true,
  }

  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    });
    if (checkAuth.data.status === true) {
      const loggedUser = checkAuth.data.data;
      this.setState({
        user: loggedUser,
        match: loggedUser.match,
        pending: false,
      });
    }
  }
   // check if person is online or offline
   // if person is online, send message directly, if person is not online, save in database
   // keep last 200 messages in chat

  render() {
    let matches = [];
    if (!this.state.pending && this.state.match) {
      matches = this.state.match.map((src, key) => <li key={key}> {src} </li>);
    }
    return (
      <div>
        <div>
          <ul>
            {matches}
          </ul>
        </div>
      </div>
    );
  }
}

export default Chat;
