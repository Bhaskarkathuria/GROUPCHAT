const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("groupinfo", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  groupname: {
    type: Sequelize.STRING,
    allowNull: false,
  }


});
module.exports = User;
