const Sequelize = require("sequelize");
const sequelize = require("./config/database");
const express = require("express");
const bodyParser = require("body-parser");
const signupRoutes = require("./routes/signup");
const loginRoutes = require("./routes/login");
const messageRoutes = require("./routes/messages");


const userinfo=require("./models/userinfo");
const messageinfo=require("./models/messages")

const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/message", messageRoutes);

app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});



userinfo.hasMany(messageinfo)
messageinfo.belongsTo(userinfo)

sequelize
  .sync()
  // .sync({force:true})
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
