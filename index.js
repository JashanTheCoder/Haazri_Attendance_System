

/* ---------------- DATABASE RELATIONSHIPS ---------------- */

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

User.hasMany(Attendance);
Attendance.belongsTo(User);

Course.hasMany(Attendance);
Attendance.belongsTo(Course);

/* ---------------- DATABASE SYNC ---------------- */


});

/* ---------------- AUTH MIDDLEWARE ---------------- */

function requireLogin(req, res, next) {


/* ---------------- ROUTES ---------------- */


});

/* ---------------- LOGIN ---------------- */

