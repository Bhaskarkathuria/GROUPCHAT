const Sequelize = require("sequelize");
const sequelize = require("./config/database");
const express = require("express");
const bodyParser = require("body-parser");
const signupRoutes = require("./routes/signup");
const loginRoutes = require("./routes/login");
const messageRoutes = require("./routes/messages");
const groupinfoRoutes = require("./routes/group");
const UserAuthentication = require("./middleware/auth");
const path = require("path");
const AWS = require("aws-sdk");

const userinfo = require("./models/userinfo");
const messageinfo = require("./models/messages");
const groupinfo = require("./models/groupinfo");
const Upload = require("./models/upload");
const raw = require("./config/sqlquery");

const cors = require("cors");

const app = express();
app.use(bodyParser.json({limit:'10mb'}));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/message", messageRoutes);
app.use("/group", groupinfoRoutes);

app.use("/uploadinfo", (req, res, next) => {
  const locationurl = req.query.locationurl;

  console.log("33333333333333333333333333333333", locationurl);

    raw.execute(
      `    SELECT u.key
    FROM uploads u
    JOIN messageinfos m ON u.link = m.text
    WHERE u.link = ${locationurl}`

    ) 


    .then((response) => {
      console.log("kkkkkkkkeeeeeeeeeeyyyyyyyy",response[0])
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
    });
});



app.post(
  "/image/upload",
   UserAuthentication.authenticate,
  async (req, res, next) => {
    try {
      console.log("DDDDDDDDDAAAAAAAAAAAATTTTTTAAAAAAA",req.body.groupid)
      const imagedata = JSON.stringify(req.body.image);
      console.log("imagee dataa",imagedata)
      let s3 = new AWS.S3({
        region: "ap-south-1",
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      s3.upload(
        {
          Bucket: "kathuriachatapp",
          Key: `${req.user.name} Chat ${new Date()}.txt`,
          Body: imagedata,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Image upload failed" });
          } else {
            Upload.create({
              link: data.Location,
              key:data.Key,
              userId: req.user.groupid,
            });
            messageinfo.create({
              name: req.user.name,
              text: data.Location,
              UserInfoId: req.user.id,
              groupinfoId: req.body.groupid, 
            });

            res.json({message: "Image uploaded successfully",data
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

app.use('/fetchbase64/:txt',(req,res,next)=>{
  const s3 = new AWS.S3({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

   const params = {
     Bucket: "kathuriachatapp",
     Key: req.params.txt,
   };

   s3.getObject(params, (err, data) => {
     if (err) {
       console.log(err);
     } else {
       res.send(Buffer.from(data.Body, "base64").toString());
     }
   });
})

app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

userinfo.hasMany(groupinfo);
groupinfo.belongsTo(userinfo);

userinfo.hasMany(messageinfo);
messageinfo.belongsTo(userinfo);

groupinfo.hasMany(messageinfo);
messageinfo.belongsTo(groupinfo);

sequelize
  .sync()
  // .sync({force:true})
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
