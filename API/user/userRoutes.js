const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/multer");

// Importing controllers
const {
  signup,
  signin,
  updateInfo,
  fetchUser,
  getTokenInfo,
  getUsersList,
  getUserById,
  deleteUser,
} = require("./userController");

// param middleware
router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  if (user) {
    req.user = user;
    next();
  } else {
    const error = new Error("No user was found with this id");
    error.status = 404;
    next(error);
  }
});

// Sign up route
router.post("/signup", upload.single("image"), signup);

// Sign in route
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

// Decode token route
router.get(
  "/getTokenInfo",
  passport.authenticate("jwt", { session: false }),
  getTokenInfo
);

// Get all users route
router.get("/", passport.authenticate("jwt", { session: false }), getUsersList);

// Get user by ID route
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  getUserById
);
// Update user
router.put(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateInfo
);
// Delete a user
router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

module.exports = router;
