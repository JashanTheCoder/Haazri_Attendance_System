const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("haazri", "root", "Khushleen@21", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

sequelize.authenticate()
.then(() => console.log("✅ Database connected successfully"))
.catch(err => console.error("❌ Unable to connect:", err));

module.exports = sequelize;
