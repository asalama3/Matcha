import React from 'react';
import axios from 'axios';

class Notifications extends React.Component {

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
        notifications: loggedUser.notifications,
        pending: false,
      });
    }
  }

  render() {
    let notifs = [];
    if (!this.state.pending && this.state.notifications) {
      notifs = this.state.notifications.map((src, key) => <p key={key}> {src} </p>);
  }
    return(
      <div> {notifs}</div>
    );
  }
}

export default Notifications;
