const Username = (req, res, next) => {
  const username = req.body.username;
  if (username && username.length > 3 && username.match(/^[a-zA-Z0-9]\w+$/)) {
    next();
  } else {
    res.send({ status: false, details: 'username not valid' });
  }
};

const Firstname = (req, res, next) => {
  const fname = req.body.firstname;
  if (fname && fname.length >= 3 && fname.match(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)) {
    next();
  } else {
    res.send({ status: false, details: 'firstname not valid' });
  }
};

const Lastname = (req, res, next) => {
  const lname = req.body.lastname;
  if (lname && lname.length >= 3 && lname.match(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)) {
    next();
  } else {
    res.send({ status: false, details: 'lastname not valid' });
  }
};

const Email = (req, res, next) => {
  const email = req.body.email;
  if (email && email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
    next();
  } else {
    return res.send({ status: false, details: 'email not valid' });
  }
  return false;
};

const Password = (req, res, next) => {
  const pass = req.body.password;
  if (pass && pass.length > 5) {
    next();
  } else {
    return res.send({ status: false, details: 'password not valid' });
  }
  return false;
};

const Gender = (req, res, next) => {
  const gender = req.body.gender;
  if (gender) {
    next();
  } else {
    res.send({ status: false, details: 'You must select a gender' });
  }
  return false;
};

const Orientation = (req, res, next) => {
  const orientation = req.body.orientation;
  if (orientation) {
    next();
  } else {
    req.body.orientation = 'bisexual';
    next();
  }
};

const Bio = (req, res, next) => {
  const bio = req.body.bio;
  if ((bio && bio.length <= 1500) || !bio) {
    return next();
  }
  return res.send({ status: false, details: 'bio cannot exceed 1500 characters' });
};

module.exports = { Username, Firstname, Lastname, Email, Password, Gender, Orientation, Bio };
