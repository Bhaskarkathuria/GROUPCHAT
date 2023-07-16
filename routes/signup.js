const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();
const User = require("../models/userinfo");

router.post("/", (req, res, next) => {
 // console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const Phonenumber = req.body.Phonenumber;
  const password = req.body.password;

  User.findOne({ where: { email } })
    .then((existinguser) => {
      if (existinguser) {
        const errormessage = "User already exist! Please Login";
        res.status(400).send(errormessage);
      } else {
        saltrounds = 10;
        bcrypt.hash(password, saltrounds, (err, hash) => {
          console.log(err);

          User.create({
            name: name,
            email: email,
            Phonenumber: Phonenumber,
            password: hash,
          })
            .then((result) => {
              return res.json({ success: true, message: "SignUp Successful" });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
