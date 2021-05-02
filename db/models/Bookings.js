module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define("Bookings", {
    date: {
      type: DataTypes.STRING,
      // type: DataTypes.DATEONLY,
      // allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    specialistId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  });

  return Bookings;
};
