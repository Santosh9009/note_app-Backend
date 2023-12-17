var jwt = require("jsonwebtoken");
const jwt_secret = "thisIsSantosh%%yoo";

const fetchuser = (req, res, next) =>{
  // Get the user from the jwt_token and add it to the req object
  const token = req.header('auth-token');

  if(!token){
    res.status(401).send("Please enter valid authentication token");
  }
  const data=jwt.verify(token, jwt_secret);
  req.user= data.user;
  next();
}

module.exports=fetchuser;