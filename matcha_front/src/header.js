import React from 'react';
import axios from 'axios';
import { browserHistory} from 'react-router';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown, FormGroup, FormControl, Button } from 'react-bootstrap/lib/';
import { LinkContainer } from 'react-router-bootstrap';
import '../css/welcome.css';

class Header extends React.Component {

  state={
    username: '',
    error: '',
    err: '',
    notif: 'notif',
    menu: 'dropdown-content',
    // message: '',
    loggedUser: null,
    pending: true,
    notifications: [],
  }

  _mounted = false;

  handleNotif = ({ notifText }) => {
      this.setState({
        notif: 'active_notif',
        notifications: [notifText, ...this.state.notifications],
      });
  }

  componentWillUnmount() {
    this._mounted = false;
    global.socket.removeEventListener('notification');
    global.socket.disconnect();
  }

  componentDidMount = async () => {
    this._mounted = true;
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!this._mounted) return false;
    const loggedUser = checkAuth.data;
    this.setState({
      loggedUser,
      notifications: loggedUser.data.notifications,
      pending: false,
    });
    global.socket.on('notification', this.handleNotif);
    // handle refresh page without clicking on notif keep button red
    // viewed vs. ' ' in database axios request
  }

  hideDiv = () => {
    if (!this._mounted) return false;
    this.setState({ err: 'err' });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ username: e.target.username.value });
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/searchLogin',
      data: {
        username: this.state.username,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!this._mounted) return false;
    if (response.data.status === true) {
      browserHistory.push(`/matcha/profile/${response.data.data.username}`);
    } else if (response.data.details === 'user blocked') {
      this.setState({ error: 'user blocked' });
    } else if (response.data.details === 'cannot search yourself') {
      this.setState({ error: 'cannot search yourself' });
    } else {
      this.setState({ error: 'no username found' });
    }
    setTimeout(this.hideDiv, 3000);
  }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({ [e.target.name]: text });
  }

  logout = async () => {
    // const response = await axios ({
    //   method: 'post',
    //   url: 'http://localhost:8080/logout',
    //   data: {
    //       username: this.state.loggedUser.data.username,
    //   }
    // });
    // if (response.data.status === true) {
      localStorage.removeItem('token');
      browserHistory.push('/');
    // }
  }

  deleteAccount = () => {
    axios({
      method: 'post',
      url: 'http://localhost:8080/deleteAccount',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(({ data }) => {
      if (!this._mounted) return false;
      if (data.status === true) {
        localStorage.removeItem('token');
        browserHistory.push('/');
      }
    });
  }

  notifications = () => {
    this.setState({ notif: 'notif' });
    if (this.state.menu === 'dropdown-content') {
      this.setState({ menu: 'menu' });
    } else {
      this.setState({ menu: 'dropdown-content' });
    }
    if (this.state.message === '') {
      this.setState({ message: 'pas de notif' });
    }
  }

  render() {
    let notifs = [];
    if (!this.state.pending && this.state.notifications) {
      notifs = this.state.notifications.map((src, key) => <p className="displayNotifs" key={key}> {src} </p>);
    }
    return (
      <div>
        <Navbar className="headerStyle" inverse collapseOnSelect >
          <Navbar.Header >
            <Navbar.Brand>
              <a className="headerList" href="/matcha/suggestions">Matcha</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown eventKey={3} title="Menu" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1} href="/matcha/editProfile">Edit My Profile</MenuItem>
                <MenuItem eventKey={3.2} href="/matcha/editPictures">Edit My Pictures</MenuItem>
                <MenuItem eventKey={3.2} href="/matcha/profile"> My Profile</MenuItem>
                <MenuItem eventKey={3.3} href="/matcha/search">Search Users</MenuItem>
                <MenuItem eventKey={3.3} href="/matcha/suggestions">Suggestions</MenuItem>
                <MenuItem eventKey={3.3} href="/matcha/notifications">Notifications</MenuItem>
                <MenuItem eventKey={3.3} href="/matcha/chat">Live Chat</MenuItem>
              </NavDropdown>
            </Nav>
            <form onSubmit={this.handleSubmit} >
            <Navbar.Form pullLeft >
              <FormGroup >
                <FormControl type="text" placeholder="Search Login" onChange={this.onChange} name="username" ref="username"/>
              </FormGroup>
               {''}
              <Button type="submit" >Submit</Button>
            </Navbar.Form>
            </form>
            <div className="dropdown">
              <button className={this.state.notif} onClick={this.notifications}>
              <i className="fa fa-bell" aria-hidden="true"></i></button>
              <div className={this.state.menu}>
                {notifs}
              </div>
            </div>
            <Nav pullRight >
              <LinkContainer to="">
                <NavItem eventKey={4} onClick={this.logout}>Logout</NavItem>
              </LinkContainer>
              <LinkContainer to="">
                <NavItem eventKey={4} onClick={this.deleteAccount}>Delete Account</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className={this.state.err}> {this.state.error} </div>
      </div>
    );
  }
}

export default Header;
