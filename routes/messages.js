const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const Op = require("sequelize");
const user = require("../models/messages");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserAuthentication = require("../middleware/auth");

router.post("/", UserAuthentication.authenticate, (req, res, next) => {
  console.log("bbbboooooddddyyy", req.user);

  const text = req.body.text;
  const name = req.user.name;

  user
    .create({
      name: name,
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

router.get("/", (req, res, next) => {
  const lastid = req.query.lastidinlocalstorage;
  console.log(lastid)

  if (lastid == undefined) {
    user
      .findAll()
      .then((alldata) => {
        res.send(alldata);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    user
      .findAll()
      .then((data) => {
        res.send(data.slice(lastid));
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
