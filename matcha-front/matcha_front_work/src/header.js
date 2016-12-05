import React from 'react';
import { browserHistory, Link } from 'react-router';
// import * as NavbarHeader from 'react-bootstrap/lib/NavbarHeader';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown, FormGroup, FormControl, Button } from 'react-bootstrap/lib/';
// import Logout from './logout';
import '../css/welcome.css';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';

class Header extends React.Component {

state={
  username: '',
}


handleSubmit = async (e) =>{
  e.preventDefault();
  console.log("entered function submit");

  this.setState({username: e.target.value});
  console.log('state', this.state.username);

  // const username = ReactDOM.findDOMNode(this.refs.username);
  // console.log('finddomnode' ,username);
  const response = await axios({
    method: 'post',
    url: 'http://localhost:8080/searchLogin',
    data: {
      username: this.state.username,
    }
  })
  if (response.data.status === true)
  {
    console.log("ok received");
    console.log(response.data);
    console.log(response.data.data.username);
    browserHistory.push('/matcha/profile/' + response.data.data.username);

  }
  else{
    console.log("not working");
    // error message erase username inputt
  }
}

onChange = (e) =>{
  const text = e.target.value;
  this.setState({[e.target.name]: text})
}

  render() {
    return (
      <div>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
      <Navbar inverse collapseOnSelect >
        <Navbar.Header >
          <Navbar.Brand>
            <a href="#">Matcha</a>
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
              <FormControl type="text" placeholder="Search Login" value={this.state.username} onChange={this.onChange}  name="username" ref="username"/>
            </FormGroup>
             {''}
            <Button type="submit" >Submit</Button>
          </Navbar.Form>
          </form>
        <Nav pullRight>
          <LinkContainer to="/matcha/logout">
            <NavItem eventKey={4}>Logout</NavItem>
          </LinkContainer>
          <LinkContainer to="/matcha/delete_account">
            <NavItem eventKey={4}>Delete Account</NavItem>
          </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
</div>
)}
}

export default Header;

// <Link to="/matcha/logout">Logout </Link>
          // <Link to="/test">TESTTEST</Link>
