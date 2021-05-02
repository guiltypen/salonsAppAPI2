const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define("Service", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      uniqe: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    salonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  SequelizeSlugify.slugifyModel(Service, {
    source: ["name"],
  });

  return Service;
};
