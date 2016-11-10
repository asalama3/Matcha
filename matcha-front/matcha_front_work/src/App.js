import React from 'react';
import * as NavbarHeader from 'react-bootstrap/lib/NavbarHeader';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown } from 'react-bootstrap/lib/';

class App extends React.Component {
  render() {
    return (
      <div>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
      <Navbar inverse collapseOnSelect>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="/">Matcha</a>
    </Navbar.Brand>
    <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
  <Nav>
      {/* <NavItem eventKey={1} href="#">Sign in</NavItem> */}
    </Nav>
  </Navbar.Collapse>
</Navbar>
<div>
{this.props.children}
</div>
      </div>
    )
  }
}

export default App;
