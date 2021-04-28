const {
  Service,
  Category,
  SpecialistServices,
  User,
} = require("../../db/models");

exports.fetchService = async (serviceId, next) => {
  try {
    const service = await Service.findByPk(serviceId);
    return service;
  } catch (error) {
    next(error);
  }
};

// Create service
exports.createServiceInCategorey = async (req, res, next) => {
  const salonId = req.user.id;
  const { categoryId } = req.params;
  try {
    const foundCategory = await Category.findOne({
      where: {
        id: +categoryId,
        salonId: +salonId,
      },
    });
    if (foundCategory && req.user.id === salonId) {
      const checkService = await Service.findOne({
        where: {
          name: req.body.name,
          categoryId: +categoryId,
        },
      });
      if (!checkService) {
        req.body.categoryId = categoryId;
        const newService = await Service.create({
          ...req.body,
          salonId: req.user.id,
        });
        res.status(201).json(newService);
      } else {
        const err = new Error("This service already exist in your salon");
        err.status = 401;
        res.json({ message: err.message });
      }
    } else {
      const err = new Error("This categorey does not exist in this salon");
      err.status = 400;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// All services list
exports.getAllServices = async (req, res, next) => {
  try {
    const foundServices = await Service.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: SpecialistServices,
          as: "specialistServices",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.status(200).json(foundServices);
  } catch (error) {
    next(error);
  }
};

// Category services List
exports.getCategoryServices = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const foundCategory = await Category.findOne({
      where: {
        id: +categoryId,
      },
    });
    if (foundCategory) {
      const foundServices = await Service.findAll({
        where: {
          categoryId: categoryId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (foundServices) {
        res.status(200).json(foundServices);
      }
    } else {
      const err = new Error("This categorey does not exist");
      err.status = 400;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// Updating service info controller
exports.updateService = async (req, res, next) => {
  const { serviceId } = req.params;
  try {
    if (req.file) {
      // req.body.image = `/media/${req.file.filename}`;
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const checkService = await Service.findByPk(serviceId);
    if (+checkService.salonId === req.user.id && req.user.role === "salon") {
      await checkService.update(req.body);
      res.status(200).json({ message: "Service info has been updated" });
    } else {
      const err = new Error("This service does not exist in this salon");
      err.status = 400;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// Deleting a service
exports.deleteService = async (req, res, next) => {
  const { serviceId } = req.params;
  try {
    const checkService = await Service.findByPk(serviceId);
    if (+checkService.salonId === req.user.id && req.user.role === "salon") {
      await checkService.destroy(req.body);
      res.status(200).json({ message: "Category has been deleted" });
    } else {
      const err = new Error("This service does not exist in this salon");
      err.status = 400;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// Assign a service to a specialist
exports.assignServiceToSpecialist = async (req, res, next) => {
  const { serviceId } = req.params;
  const { specialistId } = req.params;
  const salonId = req.user.id;
  try {
    if (req.user.role === "salon") {
      const checkService = await Service.findByPk(serviceId);
      const checkSpecialist = await User.findByPk(specialistId);
      if (
        checkService &&
        +checkService.salonId === req.user.id &&
        +checkSpecialist.salonId === req.user.id
      ) {
        const checkSpecialistService = await SpecialistServices.findOne({
          where: {
            serviceId: serviceId,
            specialistId: specialistId,
            salonId: `${salonId}`,
          },
        });
        if (!checkSpecialistService) {
          const addSpecialistToService = await SpecialistServices.create({
            salonId: req.user.id,
            serviceId: serviceId,
            specialistId:
              checkSpecialist.role === "specialist" ? specialistId : null,
            categoryId: checkService.categoryId,
            serviceName: checkService.name,
            specialistName: checkSpecialist.username,
            // specialistId: specialistId,
          });
          res.status(201).json(addSpecialistToService);
        } else {
          res.status(500).json({
            message: "This service is already assigned to this specialist",
          });
        }
      } else {
        const err = new Error(
          "Either this service or this specialist does not exist in your salon, "
        );
        err.status = 401;
        res.json({ message: err.message });
      }
    }
  } catch (error) {
    next(error);
  }
};

// Remove service from a specialist
exports.removeServiceFromSpecialist = async (req, res, next) => {
  const { serviceId } = req.params;
  const { specialistId } = req.params;
  const salonId = req.user.id;
  try {
    if (req.user.role === "salon") {
      const checkSpecialistService = await SpecialistServices.findOne({
        where: {
          serviceId: serviceId,
          specialistId: specialistId,
          salonId: `${salonId}`,
        },
      });
      if (checkSpecialistService) {
        await checkSpecialistService.destroy();
        res.status(200).json({
          message: "This service has been removed from this specialist",
        });
      } else {
        res.status(500).json({
          message: "This service is not assigned to this specialist",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
