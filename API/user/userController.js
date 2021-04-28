const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../db/config/keys");

//fetch
exports.fetchUser = async (userId, next) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    next(error);
  }
};

// User sign up controller
exports.signup = async (req, res, next) => {
  const saltRounds = 10;
  const { password } = req.body;
  try {
    if (req.file) {
      req.body.image = `media/${req.file.filename}`;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create({ ...req.body, role: "customer" });
    const payload = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      gender: newUser.gender,
      email: newUser.email,
      phone: newUser.phone,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token: token });
  } catch (error) {
    next(error);
  }
};

// User sign in controller
exports.signin = (req, res) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      gender: user.gender,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
    };
    if (req.user.role === "customer" || "specialist") {
      const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
      res.json({ token: token });
    } else {
      res
        .status(400)
        .json({ message: "Only specialists and customers can sign in" });
    }
  } catch (error) {
    next(error);
  }
};

// Get token info controller
exports.getTokenInfo = (req, res, next) => {
  res.json(req.user);
};

// Users list controller
exports.getUsersList = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const users = await User.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      res.status(200).json(users);
    } else {
      res.status(400).json({ message: "Only admins can view users list" });
    }
  } catch (error) {
    res.status(500).json("No users found");
  }
};

// Get user by his id
exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (req.user.role === "admin") {
      const foundUser = await User.findByPk(userId);
      res.status(200).json({ foundUser: foundUser });
    } else {
      res.status(400).json({ message: "Only admins can view users" });
    }
  } catch (error) {
    next(error);
  }
};

// update user info
exports.updateInfo = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;
  const saltRounds = 10;
  try {
    if (req.user.id === +userId) {
      if (req.file) {
        // req.body.image = `/media/${req.file.filename}`;
        req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;
      }
      await req.user.update(req.body);
      res.status(200).json({ message: "user info has been updated" });
    } else {
      res.status(400).json({
        message: "Only this account user can update the account info",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Deleting a user
exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (
      (req.user.id === +userId && req.user.role === "customer") ||
      req.user.role === "admin"
    ) {
      await req.user.destroy(req.body);
      res.status(200).json({ message: "user account has been deleted" });
    } else {
      res.status(400).json({
        message: "Only app admins or this account user can delete this account",
      });
    }
  } catch (error) {
    next(error);
  }
};
