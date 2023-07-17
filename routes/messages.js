const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const user = require("../models/messages");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAuthentication = require("../middleware/auth");

router.post("/", UserAuthentication.authenticate, (req, res, next) => {
console.log("bbbboooooddddyyy",req.user)

  const text = req.body.text;
  const name=req.user.name
  

  user
    .create({
      name:name,
      text: text,
      UserInfoId: req.user.id,
    })
    .then((result) => {
      return res.json({ success: true, message: "Message Sent" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (req, res, next)=>{
  user.findAll()
  .then((data)=>{
    res.send(data)
  })
  .catch((err)=>{
    console.log(err)
  })
});

module.exports = router;
