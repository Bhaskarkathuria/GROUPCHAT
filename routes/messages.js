const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");

const user = require("../models/messages");


const UserAuthentication = require("../middleware/auth");

router.post("/", UserAuthentication.authenticate, (req, res, next) => {
  console.log("bbbboooooddddyyy", req.user);
  console.log("gggggggggggggggggg", req.query.groupid);
  const text = req.body.text;
  const name = req.user.name;
  const groupinfoId = req.query.groupid;

  user
    .create({
      name: name,
      text: text,
      UserInfoId: req.user.id,
      groupinfoId: groupinfoId,
    })
    .then((result) => {
      return res.json({ success: true, message: "Message Sent" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", UserAuthentication.authenticate,(req, res, next) => {
  const lastid = req.query.lastidinlocalstorage;
  const currentGroupId = req.query.currentGroupId;

  console.log("CCCCCCCGGGGGGGG",currentGroupId)
  console.log(lastid)

  if (lastid == undefined) {
    user
      .findAll({where:{groupinfoId:currentGroupId}})
      .then((alldata) => {
        res.send(alldata);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    user
      .findAll({ where: { groupinfoId: currentGroupId } })
      .then((data) => {
        res.send(data.slice(lastid));
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
