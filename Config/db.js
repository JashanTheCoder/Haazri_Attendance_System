const { Sequelize } = require("sequelize");

const SKIP_DB = process.env.SKIP_DB === "1" || process.env.SKIP_DB === "true";

const sequelize = new Sequelize("haazri", "root", "Khushleen@21", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

if (!SKIP_DB) {
  sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Unable to connect:", err));
} else {
  console.log("⚠️ SKIP_DB enabled: database connection skipped");
}

module.exports = sequelize;
