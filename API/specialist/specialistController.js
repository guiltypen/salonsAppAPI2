const { User, SpecialistServices } = require("../../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../db/config/keys");

// Salon's specialist list controller
exports.fetchSpecialists = async (req, res, next) => {
  try {
    const foundSpecialists = await User.findAll({
      where: {
        role: "specialist",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      // include: [
      //   {
      //     model: SpecialistServices,
      //     as: "specialistServices",
      //     attributes: {
      //       exclude: ["createdAt", "updatedAt"],
      //     },
      //   },
      // ],
    });
    if (foundSpecialists) {
      res.status(200).json(foundSpecialists);
    }
  } catch (error) {
    next(error);
  }
};

// Add new specialist in a salon
exports.addSpecialistInSalon = async (req, res, next) => {
  const salonId = req.user.id;
  const { password } = req.body;
  const saltRounds = 10;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      if (req.file) {
        // req.body.image = `/media/${req.file.filename}`;
        req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      const checkUser = await User.findOne({
        where: req.body,
      });
      if (!checkUser) {
        req.body.salonId = req.user.id;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;
        const newSpecialist = await User.create({
          ...req.body,
          role: "specialist",
          salonId: req.user.id,
        });
        const payload = {
          id: newSpecialist.id,
          username: newSpecialist.username,
          gender: newSpecialist.gender,
          role: newSpecialist.role,
          exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
        };
        const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
        res.status(201).json({
          message: "Specialist has been added to your salon",
          token: token,
        });
      } else {
        const err = new Error(
          "This specialist is already added in your salon, or works at a different salon"
        );
        err.status = 401;
        res.json({ message: err.message });
      }
    } else {
      const err = new Error("Only this salon manager can add new specialist");
      err.status = 401;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// Deleting a user
exports.deleteSpecialistFromSalon = async (req, res, next) => {
  const salonId = req.user.id;
  const { specialistId } = req.params;
  try {
    if (req.user.role === "salon") {
      const checkSpecialist = await User.findOne({
        where: {
          id: specialistId,
          role: "specialist",
          salonId: `${salonId}`,
        },
      });
      if (checkSpecialist) {
        await checkSpecialist.destroy();
        res
          .status(200)
          .json({ message: "specialist account has been deleted" });
      } else {
        res
          .status(400)
          .json({ message: "This specialist was not found in your salon" });
      }
    } else {
      res.status(400).json({
        message: "Only this salon manager can delete this account",
      });
    }
  } catch (error) {
    next(error);
  }
};
