module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define("Bookings", {
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialistId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Bookings;
};
