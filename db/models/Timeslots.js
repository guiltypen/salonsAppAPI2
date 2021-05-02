module.exports = (sequelize, DataTypes) => {
  const Timeslots = sequelize.define("Timeslots", {
    Time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Timeslots;
};
