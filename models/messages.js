 const Sequelize=require('sequelize')
 const sequelize=require('../config/database')

 const User = sequelize.define("MessageInfo", {
   id: {
     type: Sequelize.INTEGER,
     allowNull: false,
     autoIncrement: true,
     primaryKey: true,
   },
   name: {
     type: Sequelize.STRING,
     allowNull: false,
   },
 
   text: {
     type: Sequelize.STRING,
     allowNull: false,
   },
 });

 module.exports=User;