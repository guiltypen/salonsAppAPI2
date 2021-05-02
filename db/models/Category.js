const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: {
      //   args: true,
      //   msg: "This category name already exists",
      // },
    },
    slug: {
      type: DataTypes.STRING,
      uniqe: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  SequelizeSlugify.slugifyModel(Category, {
    source: ["name"],
  });

  return Category;
};
