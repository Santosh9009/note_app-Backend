const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const jwt_secret="thisIsSantosh%%yoo";

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Passoword must have atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // returns a bad request if error in request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //checks weather if a user with same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "A user with this email exists already" });
      }

      // hashing the password
      const salt =await bcrypt.genSalt(10);
      const secPass =await bcrypt.hash(req.body.password, salt);

      // creates a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      const data={
        user:{
          id:user.id
        }
      }
      const authToken=jwt.sign(data,jwt_secret);
      res.json(authToken);
    } 
    catch (error) {
      console.log(error.message);
      req.status(500).json("some error occured");
    }
  }
);

module.exports = router;
