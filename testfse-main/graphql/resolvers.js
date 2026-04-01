const { User, Course, Attendance } = require('../models');

module.exports = {
  users: async () => await User.findAll(),
  
  courses: async () => await Course.findAll(),

  allAttendance: async () => await Attendance.findAll(),

  userAttendance: async ({ userId }) => await Attendance.findAll({ where: { UserId: userId } }),

  createUser: async ({ username, email, password }) => {
    return await User.create({ username, email, password });
  },

  markAttendance: async ({ userId, courseName, delivered, attended }) => {
    const percentage = (attended / delivered) * 100;
    return await Attendance.create({ 
      UserId: userId, 
      courseName, 
      delivered, 
      attended, 
      percentage 
    });
  }
};
