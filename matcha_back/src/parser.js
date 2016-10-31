const Username = (data, response) => {
  console.log('dwadawd', data.username);
  var test = data.username;
  if (test && test.length > 3)
  {  console.log("ok"); }
  else {
    console.log("not ok");
  }
}

module.exports = {Username};
