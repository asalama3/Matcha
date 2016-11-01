const Username = (req, response, next) => {
  var username = req.body.username;
  console.log('dwadawd', username);

  if (username && username.length > 4 && username.match(/^[a-zA-Z0-9]\w+$/))
  {
    console.log("ok");
    // return true;
    next();
  }
  else {
    console.log("not ok");
    response.send({status: false, details:'username not valid'});
  }
}

const Firstname = (req, response, next) => {
  var fname = req.body.firstname;
  console.log('firstname:', fname);
  if (fname && fname.length > 4 && fname.match(/^[a-zA-Z0-9]\w+$/))
  {
    console.log("ok");
    next();
  }
  else {
    console.log("not ok");
    response.send({status: false, details:'firstname not valid'});
  }
}

const Lastname = (req, response, next) => {
  var lname = req.body.lastname;
  console.log('lastname:', lname);
  if (lname && lname.length > 4 && lname.match(/^[a-zA-Z0-9]\w+$/))
  {
    console.log("ok");
    next();
  }
  else {
    console.log("not ok");
    response.send({status: false, details:'username not valid'});
  }
}

const Password = (req, response, next) => {
  var pass = req.body.password;
  if (pass && pass.length > 5)
  {
    console.log("ok");
    next();
  }
  else{
    console.log("not ok");
    response.send({status: false, details:'username not valid'});
  }
}


module.exports = {Username, Firstname, Lastname, Password};
