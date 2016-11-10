import React from 'react';
import * as NavbarHeader from 'react-bootstrap/lib/NavbarHeader';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown } from 'react-bootstrap/lib/';

class Header extends React.Component {
  render() {
    return (
      <div>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
      <Navbar inverse collapseOnSelect>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="#">Matcha</a>
    </Navbar.Brand>
    <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
  <Nav>
    {/* <Nav style= {{background: 'red'}}> */}
      {/* <NavItem eventKey={1} href="#">Add Link</NavItem> */}
      {/* <NavItem eventKey={2} href="#">Add Link</NavItem> */}
      <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
        <MenuItem eventKey={3.1} href="./editProfile">Edit Profile</MenuItem>
        <MenuItem eventKey={3.2}>Edit Pictures</MenuItem>
        <MenuItem eventKey={3.3}>Search</MenuItem>
        <MenuItem eventKey={3.3}>Suggestions</MenuItem>
        <MenuItem eventKey={3.3}>Live Chat</MenuItem>
      </NavDropdown>
    </Nav>
    <Nav pullRight>
      <NavItem eventKey={1} href="#">Delete Account</NavItem>
      <NavItem eventKey={2} href="#">Logout</NavItem>
    </Nav>
  </Navbar.Collapse>
</Navbar>
      </div>
    )
  }
}

export default Header;
