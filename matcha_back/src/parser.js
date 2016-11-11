const Username = (req, res, next) => {
  var username = req.body.username;

  // console.log('dwadawd', username);

  if (username && username.length > 4 && username.match(/^[a-zA-Z0-9]\w+$/))
  {
    // console.log("username ok");
    next();
  }
  else {
    console.log("username not ok");
    res.send({status: false, details:'username not valid'});
  }
}

const Firstname = (req, res, next) => {
  var fname = req.body.firstname;
  // console.log('firstname:', fname);
  if (fname && fname.length > 4 && fname.match(/^[a-zA-Z0-9]\w+$/))
  {
    // console.log(" fname ok");
    next();
  }
  else {
    console.log("fname not ok");
    res.send({status: false, details:'firstname not valid'});
  }
}

const Lastname = (req, res, next) => {
  var lname = req.body.lastname;
  // console.log('lastname:', lname);
  if (lname && lname.length > 4 && lname.match(/^[a-zA-Z0-9]\w+$/))
  {
    // console.log(" lname ok");
    next();
  }
  else {
    console.log(" lname not ok");
    res.send({status: false, details:'lastname not valid'});
  }
}

const Email = (req, res, next) => {
  var email = req.body.email;
  // console.log('email', email);
  if (email && email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/))
  {
    // console.log("email ok");
    next();
  }
  else{
    console.log("email not ok");
    res.send({status: false, details: 'email not valid'});
  }
}

const Password = (req, res, next) => {
  var pass = req.body.password;
  if (pass && pass.length > 5)
  {
    // console.log("ok");
    next();
  }
  else{
    console.log("not ok");
    res.send({status: false, details:'password not valid'});
  }
}


module.exports = {Username, Firstname, Lastname, Email, Password};




