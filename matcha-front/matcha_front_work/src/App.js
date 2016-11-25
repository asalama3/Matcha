import React from 'react';
// import * as NavbarHeader from 'react-bootstrap/lib/NavbarHeader';
import { Navbar, Nav, } from 'react-bootstrap/lib/';
import '../css/welcome.css';
// 'use strict';


class App extends React.Component {
  render() {
    return (
      <div>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />

<div>
         <video id="video" loop autoPlay="true" muted>
                <source className="video" src={require("../video/Couples_cut_and_blur20.mp4")} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
</div>
<div> {this.props.children} </div>
      </div>
    )
  }
}

export default App;
