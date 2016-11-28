import React from 'react';
import * as NavbarHeader from 'react-bootstrap/lib/NavbarHeader';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown, FormGroup, FormControl, Button } from 'react-bootstrap/lib/';

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
      <NavDropdown eventKey={3} title="Menu" id="basic-nav-dropdown">
        <MenuItem eventKey={3.1} href="./editProfile">Edit Profile</MenuItem>
        <MenuItem eventKey={3.2} href="./editPictures">Edit Pictures</MenuItem>
        <MenuItem eventKey={3.3}>Search</MenuItem>
        <MenuItem eventKey={3.3}>Suggestions</MenuItem>
        <MenuItem eventKey={3.3}>Live Chat</MenuItem>
      </NavDropdown>
    </Nav>
         <Navbar.Form pullLeft>
        <FormGroup>
          <FormControl type="text" placeholder="Search" />
        </FormGroup>
        {' '}
        <Button type="submit">Submit</Button>
      </Navbar.Form>
    <Nav pullRight>
      <NavItem eventKey={1} href="#">Delete Account</NavItem>
      <NavItem eventKey={2} href="./logout">Logout</NavItem>
    </Nav>
  </Navbar.Collapse>
</Navbar>
      </div>
    )
  }
}

export default Header;
