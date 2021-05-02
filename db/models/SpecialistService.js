module.exports = (sequelize, DataTypes) => {
  const SpecialistServices = sequelize.define("SpecialistServices", {
    salonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return SpecialistServices;
};
