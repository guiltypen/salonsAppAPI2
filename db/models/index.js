"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Salon and Category relation
db.Salon.hasMany(db.Category, {
  foreignKey: "salonId",
  as: "categories",
  allowNull: false,
});
db.Category.belongsTo(db.Salon, {
  foreignKey: "salonId",
  as: "salon",
});

// Salon and customer relation
db.Salon.belongsToMany(db.User, {
  foreignKey: "salonId",
  as: "salons",
  through: "Bookings",
});
db.User.belongsToMany(db.Salon, {
  foreignKey: "userId",
  as: "users",
  through: "Bookings",
});

//Category and Service (One to many)
db.Category.hasMany(db.Service, {
  foreignKey: "categoryId",
  as: "services",
});
db.Service.belongsTo(db.Category, {
  foreignKey: "categoryId",
});

// Service and specialist relation
db.Service.belongsToMany(db.User, {
  foreignKey: "serviceId",
  // as: "services",
  through: "SpecialistServices",
});
db.User.belongsToMany(db.Service, {
  foreignKey: { name: "specialistId", allowNull: false },
  // as: "specialists",
  through: "SpecialistServices",
});

//Service and specialist services
db.Service.hasMany(db.SpecialistServices, {
  foreignKey: "serviceId",
  as: "specialistServices",
});
db.SpecialistServices.belongsTo(db.Service, {
  foreignKey: "serviceId",
});

// // Salon and specialist relation
// db.Salon.hasMany(db.User, {
//   foreignKey: "salonId",
//   as: "specialists",
// });
// db.User.belongsTo(db.Salon, {
//   foreignKey: "salonId",
//   as: "salon",
// });

module.exports = db;
