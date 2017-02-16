import mongodb from 'mongodb';
import mongoConnect from '../mongo_connect';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const sendMail = (to, subject, text) => {
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'andreasalama2@gmail.com',
          pass: 'newyork2289'
      }
  });
  let mailOptions = {
    from: '"Andrea Salama 👻" <andreasalama2@gmail.com>',
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      res.send({ status: false, details:'send email failure' });
    }
  });
}

const forgotPass = (req, res) => {
  // send email to user to reset password
  mongoConnect(res, async (db) => {
    const users = db.collection('users');
    const { email } = req.body;
    const askedUser = await users.findOne({ email });
    if (!askedUser) return res.send({ status: false, details: `${email} does not exist` });
    const key = crypto.randomBytes(20).toString('hex');
    await users.update({ email }, { $set: { resetKey: key } });
    sendMail(email, `Reset your password`, `use this key ${key} to reset your password` );
    res.send({ status: true, details: `an email has been sent to ${email}` });
  });
}

const resetPass = (req, res) => {
  mongoConnect(res, async(db) => {
    const hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    const users = db.collection('users');
    const askedUser = await users.findOne({ username: req.body.username });
    if (!askedUser) {
      return res.send({ status: false, details: "username doesn't exist" });
    } else if (askedUser && askedUser.resetKey !== req.body.key) {
      return res.send({ status: false, details: "could not update password with this key" });
    } else {
      users.update({ username: req.body.username },
        { $set : { password: hashPass }, $unset: { resetKey: '' } });
      res.send({ status: true, details: "successfully updated your password" });
    }
  });
}

export { forgotPass, resetPass } ;


// send email : check email + add key to reset password + send email with key
// link in email ou send with new form after submit
// reset password: check key + change password in db if key is ok
// success back to login
