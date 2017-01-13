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
    notif: 'notif',
    menu: 'dropdown-content',
    // message: '',
    loggedUser: null,
    pending: true,
    notifications: [],
  }

  handleNotif = ({ message }) => {
      this.setState({
        notif: 'active_notif',
        notifications: [message, ...this.state.notifications],
      });
  }

  componentWillUnmount() {
    global.socket.removeEventListener('notification');
  }

  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
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

  handleSubmit = async (e) => {
    console.log(e.target.username.value);
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
    if (response.data.status === true) {
      browserHistory.push(`/matcha/profile/${response.data.data.username}`);
    } else {
      this.setState({ error: 'no username found' });
      // make it disappear
    }
  }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({ [e.target.name]: text });
  }

  logout = async () => {
    const response = await axios ({
      method: 'post',
      url: 'http://localhost:8080/logout',
      data: {
          username: this.state.loggedUser.data.username,
      }
    });
    if (response.data.status === true) {
      localStorage.removeItem('token');
      browserHistory.push('/');
    }
  }

  deleteAccount = () => {
    axios({
      method: 'post',
      url: 'http://localhost:8080/deleteAccount',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(({ data }) => {
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
      notifs = this.state.notifications.map((src, key) => <p key={key}> {src} </p>);
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
                <MenuItem eventKey={3.3}>Suggestions</MenuItem>
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
        <div> {this.state.error} </div>
      </div>
    );
  }
}

export default Header;
