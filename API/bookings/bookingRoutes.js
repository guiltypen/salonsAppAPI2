const express = require("express");
const router = express.Router();
const passport = require("passport");

// Importing controllers
const {
  newBooking,
  // fetchBooking,
  confirmBooking,
  getBooking,
} = require("./bookingsController");

// param middleware
// router.param("bookingId", async (req, res, next, bookingId) => {
//   const booking = await fetchBooking(bookingId, next);
//   if (booking) {
//     req.booking = booking;
//     next();
//   } else {
//     const error = new Error("No booking was found with this id");
//     error.status = 404;
//     next(error);
//   }
// });

// New booking route
router.post("/", passport.authenticate("jwt", { session: false }), newBooking);

// Specialist confirm booking
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  confirmBooking
);

// Get bookings
router.get("/:salonId", getBooking);

module.exports = router;
