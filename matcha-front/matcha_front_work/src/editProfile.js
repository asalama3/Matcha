import React, {Component} from 'react';
// import axios from 'axios';
// import { browserHistory } from 'react-router';
// import * as NavbarHeader from 'react-bootstrap/lib/NavbarHeader';

import { Checkbox, FormGroup, ControlLabel, Radio, FormControl, Button, NavbarHeader} from 'react-bootstrap/lib/';
// import {FieldGroup} from 'react-bootstrap/lib/';


class editProfile extends Component{
  render(){
    return(
<div>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />

<form>
{/* <FieldGroup
  id="formControlsText"
  type="text"
  label="Text"
  placeholder="Enter text"
/>
<FieldGroup
  id="formControlsEmail"
  type="email"
  label="Email address"
  placeholder="Enter email"
/>
<FieldGroup
  id="formControlsPassword"
  label="Password"
  type="password"
/>
<FieldGroup
  id="formControlsFile"
  type="file"
  label="File"
  help="Example block-level help text here."
/> */}


<FormGroup>
  <Radio inline>
    Male
  </Radio>
  {' '}
  <Radio inline>
    Female
  </Radio>
  {' '}
  <Radio inline>
    Bisexual
  </Radio>
</FormGroup>
<FormGroup controlId="formControlsSelect">
  <ControlLabel>Age</ControlLabel>
  <FormControl componentClass="select" placeholder="select">
    <option value="select">select</option>
    <option value="other">18</option>
    <option value="other">19</option>
    <option value="other">20</option>
    <option value="other">21</option>

  </FormControl>
</FormGroup>
<FormGroup controlId="formControlsSelectMultiple">
  <ControlLabel>Multiple select</ControlLabel>
  <FormControl componentClass="select" multiple>
    <option value="select">select (multiple)</option>
    <option value="other">...</option>
    <option value="other">...</option>
    <option value="other">...</option>
    <option value="other">...</option>
    <option value="other">...</option>
    <option value="other">...</option>

  </FormControl>
</FormGroup>

<FormGroup controlId="formControlsTextarea">
  <ControlLabel>Bio</ControlLabel>
  <FormControl componentClass="textarea" placeholder="bio" />
</FormGroup>


<Button type="submit">
  Submit
</Button>
</form>
</div>
    )
  }

}

export default editProfile;
