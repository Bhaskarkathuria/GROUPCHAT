const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const raw = require("../config/sqlquery");

const user = require("../models/groupinfo");
// const groupUser = require("../models/groupUser");

const UserAuthentication = require("../middleware/auth");
const GroupUser = require("../models/groupUser");



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
      GroupUser.create({
        UserId: req.user.id,
        GroupId: result.id,
      });

      return res.json({ groupid: result.id, adminid: req.user.id });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/editname", UserAuthentication.authenticate, (req, res, next) => {
  const newname = req.body.groupName;
  const groupid = req.body.groupid;

  // Useing placeholders in the SQL query
  raw
    .execute(
      `
      UPDATE groupinfos  
      INNER JOIN groupusers  
      ON groupinfos.id = groupusers.GroupId  
      SET groupname = ? 
      WHERE groupusers.GroupId = ?
      `,
      [newname, groupid] // Passing the values as an array of parameters
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);

    });
});


router.get("/", UserAuthentication.authenticate, (req, res, next) => {
  const userid = req.user.id;
  user
    .findAll({ where: { UserInfoId: userid } })
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

router.get("/admin/:groupid", UserAuthentication.authenticate, (req, res, next) => {
  const groupid = req.params.groupid;
  console.log("gggggggg",groupid)
  raw
    .execute(
      `SELECT subquery.groupid,
       subquery.admin,
       subquery.member,
       cg.name AS member_name
FROM (
    SELECT cg.groupinfoId AS groupid,
           cg.UserInfoId AS admin,
           gu.UserId AS member
    FROM messageinfos cg
    JOIN GroupUsers gu ON cg.groupinfoId = gu.GroupId
    WHERE cg.groupinfoId = ${groupid}
) AS subquery
JOIN messageinfos cg ON subquery.member = cg.UserInfoId;
`)
    .then((result) => {
      console.log(result);
      if (req.user.id == result[0][0].admin) {
        result[0]//.push(true);
      } else {
        result[0]//.push(false);
      }
      res.send(result[0]);
    })
    .catch((err) => {
      console.log(err);
    });
}
);

// http://localhost:3000/group/copylink/addmember/2
router.get("/copylink/addmember/:groupid", UserAuthentication.authenticate, async (req, res, next) => {
  const userid = req.user.id;
  const groupid = req.params.groupid;
  console.log('uuuuuuuuuuuuuuuuuuuuuuu', userid, groupid)

  raw
    .execute(
      `SELECT * FROM groupusers 
      WHERE GroupId=${req.params.groupid} AND UserId=${req.user.id}`
    )
    .then((response) => {
      if (!response[0][0]) {
        GroupUser.create({
          UserId: req.user.id,
          GroupId: parseInt(req.params.groupid),
        }).catch((err) => {
          console.log(err);
        });
      } else {
        res.status(401).send("Already a member.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
);


router.get("/removemember", UserAuthentication.authenticate, (req, res, next) => {
  GroupUser.destroy({ where: { Userid: req.query.memberId, GroupId: req.query.groupId } })
});

module.exports = router;
