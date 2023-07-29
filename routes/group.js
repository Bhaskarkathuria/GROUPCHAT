const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const raw = require("../config/sqlquery");

const user = require("../models/groupinfo");
const groupUser = require("../models/groupUser");

const UserAuthentication = require("../middleware/auth");

router.post("/", UserAuthentication.authenticate, (req, res, next) => {
  const name = req.body.groupName;
  const id = req.user.id;
  console.log("iiiiiiidddddddddd", id);

  user
    .create({
      groupname: name,
      UserInfoId: id,
    })
    .then((result) => {
      groupUser.create({
        UserId: req.user.id,
        GroupId: result.id,
      });

      return res.json({ groupid: result.id });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/editname", UserAuthentication.authenticate, (req, res, next) => {
  const newname = req.body.groupName;
  const groupid = req.body.groupid;

  // Use placeholders in the SQL query
  raw
    .execute(
      `
      UPDATE groupinfos  
      INNER JOIN groupusers  
      ON groupinfos.id = groupusers.GroupId  
      SET groupname = ? 
      WHERE groupusers.GroupId = ?
      `,
      [newname, groupid] // Pass the values as an array of parameters
    )
    .then((response) => {
      console.log(response);
      // Send a success response or perform any other necessary actions
    })
    .catch((error) => {
      console.log(error);
      // Handle the error appropriately
    });
});


router.get("/", UserAuthentication.authenticate, (req, res, next) => {
  user
    .findAll()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});


router.get("/delete/:groupid", (req, res, next) => {
  const groupid = req.params.groupid;

    raw
      .execute(
        `
    DELETE groupinfos
    FROM groupinfos
    INNER JOIN groupusers
    ON groupinfos.id = groupusers.GroupId
    WHERE groupusers.GroupId = ${groupid}
    `
      )
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the group." });
      });
});


module.exports = router;
