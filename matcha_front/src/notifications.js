import React from 'react';
import axios from 'axios';
import '../css/notifications.css';

class Notifications extends React.Component {

  state = {
    user: '',
    pending: true,
  }

  _mounted = false;

  componentWillUnMount() { this._mounted = false; }

  componentDidMount = async () => {
    this._mounted = true;
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!this._mounted) return false;
    if (checkAuth.data.status === true) {
      const loggedUser = checkAuth.data.data;
      this.setState({
        user: loggedUser,
        notifications: loggedUser.notifications,
        views: loggedUser.views,
        match: loggedUser.match,
        pending: false,
      });
    }
  }

  render() {
    let notifs = [];
    if (!this.state.pending && this.state.notifications) {
      notifs = this.state.notifications.map((src, key) => {
        if (!src.includes("sent")){
          return (
          <li key={key} className="like"> {src} </li>)
        }
        return false;
      });
    }
    let visits = [];
    if (!this.state.pending && this.state.views) {
      visits = this.state.views.name.map((src, key) => <li key={key} className="view"> {src} visited your profile! </li>);
    }
    let matches = [];
    if (!this.state.pending && this.state.match) {
      matches = this.state.match.map((src, key) => <li key={key} className="match"> {src} is a match! </li>);
    }
    let chatNotif = [];
    if (!this.state.pending && this.state.notifications) {
      chatNotif = this.state.notifications.map((src, key) => {
        if (src.includes("sent")){
          return (<li key={key}> {src} </li>);
        }
        return false;
      });
    }
    return(
      <div className="history">
      <div className="notifs">
      <h1>LIKES</h1>
        <div className="nv">{notifs} </div>
      </div>
      <div className="visits">
      <h1>VISITS</h1>
      <div className="nv">{visits}</div>
      </div>
      <div className="match">
      <h1>MATCHES</h1>
      <div className="meet">{matches}</div>
      </div>
      <div className="newMessages">
      <h1>NEW MESSAGES</h1>
      <div className="chatMess">{chatNotif}</div>
      </div>
      </div>
    );
  }
}

export default Notifications;
