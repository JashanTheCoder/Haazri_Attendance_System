const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const Attendance = sequelize.define("Attendance", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id"
    }
  },

  courseName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  delivered: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  attended: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  percentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

});

module.exports = Attendance;
