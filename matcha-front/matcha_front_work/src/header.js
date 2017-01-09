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
  }

  componentWillMount() {
    global.socket.on('notification', (data) => {
      this.setState({ notif: 'active_notif' });
      console.log('data', data);
    });
  }

  componentWillUnmount() {
    global.socket.removeEventListener('notification');
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
      // console.log(response.data.data);
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

  logout = () => {
    localStorage.removeItem('token');
    browserHistory.push('/');
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
    // activate menu
    // disactivate color red from button
    
  }

  render() {
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
                <MenuItem eventKey={3.1} href="/matcha/editProfile">Edit Profile</MenuItem>
                <MenuItem eventKey={3.2} href="/matcha/editPictures">Edit Pictures</MenuItem>
                <MenuItem eventKey={3.2} href="/matcha/profile">Profile</MenuItem>
                <MenuItem eventKey={3.3} href="/matcha/search">Search</MenuItem>
                <MenuItem eventKey={3.3}>Suggestions</MenuItem>
                <MenuItem eventKey={3.3}>Live Chat</MenuItem>
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
            <button className={this.state.notif} onClick={this.notifications}>
              <i className="fa fa-bell" aria-hidden="true"></i></button>
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
