const { Bookings, User, Salon } = require("../../db/models");

// exports.fetchBooking = async (bookingId, res, next) => {
//   try {
//     const booking = await Bookings.findAll({
//       where: {
//         salonId: bookingId,
//       },
//     });
//     res.json(booking);
//   } catch (err) {
//     next(err);
//   }
// };

exports.getBooking = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    const booking = await Bookings.findAll({
      where: {
        salonId: salonId,
      },
    });
    res.status(200).json({ thisSalonBookings: booking });
  } catch (error) {
    next(error);
  }
};

// Making new booking
exports.newBooking = async (req, res, next) => {
  try {
    console.log(req.user.role);
    // if (req.user.role === "customer") {
    // Check customer
    const customer = await User.findOne({
      where: {
        id: req.user.id,
        role: "customer",
      },
    });

    // Check salon
    const salon = await Salon.findOne({
      where: {
        id: req.body.salonId,
      },
    });

    // res.json(checkBooking);
    if (customer && salon) {
      const checkBooking = await Bookings.findOne({
        where: {
          time: req.body.time,
          salonId: req.body.salonId,
          specialistId: req.body.specialistId,
          date: req.body.date,
          customerId: req.user.id,
          service: req.body.service,
          status: "pending",
        },
      });

      if (!checkBooking) {
        // Check specialist
        const checkSpecialist = await User.findOne({
          where: {
            id: req.body.specialistId,
            salonId: req.body.salonId,
            role: "specialist",
          },
        });
        if (checkSpecialist) {
          const newBooking = await Bookings.create({
            ...req.body,
            customerId: req.user.id,
          });
          res.status(200).json(newBooking);
        } else {
          res
            .status(400)
            .json({ Error: "This specilist does not work at this salon" });
        }
      } else {
        res.status(400).json({ Error: "This booking already exists" });
      }
    } else {
      res.status(403).json({
        Error: "This salon does not exist",
      });
    }
    // } else {
    //   res.status(401).json({ Error: "Only customers can make appointments" });
    // }
  } catch (error) {
    next(error);
    // res.json(error);
  }
};

// accept booking
exports.confirmBooking = async (req, res, next) => {
  try {
    const specialist = await User.findOne({
      where: {
        id: req.user.id,
        role: "specialist",
      },
    });

    if (specialist) {
      const toFindBooking = await Bookings.findOne({
        where: {
          salonId: req.user.salonId,
          specialistId: req.user.id,
          status: "pending",
          time: req.body.time,
          date: req.body.date,
          customerId: req.body.customerId,
          service: req.body.service,
        },
      });

      if (toFindBooking) {
        await toFindBooking.update({ status: "confirmed" });
        res.json(toFindBooking);
      } else {
        res.status(404).json({
          Error:
            "This booking does not exist, or you are not authorized, or has already been confirmed",
        });
      }
    } else {
      res.status(404).json("Specialist was not found");
    }
  } catch (error) {
    next(error);
  }
};
