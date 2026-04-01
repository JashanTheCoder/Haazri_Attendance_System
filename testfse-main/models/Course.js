const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const Course = sequelize.define("Course", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  courseName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  courseCode: {
    type: DataTypes.STRING
  },

  teacherName: {
    type: DataTypes.STRING
  }

});

module.exports = Course;