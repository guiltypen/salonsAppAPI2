// // Create service
// exports.addTimeslotsToSpecialist = async (req, res, next) => {
//     const specialistId = req.user.id;
//     try{

//     } catch (error){
//         next(error)
//     }

//     const { categoryId } = req.params;
//     try {
//       const foundCategory = await Category.findOne({
//         where: {
//           id: +categoryId,
//           specialistId: +specialistId,
//         },
//       });
//       if (foundCategory && req.user.id === specialistId) {
//         const checkService = await Service.findOne({
//           where: {
//             name: req.body.name,
//             categoryId: +categoryId,
//           },
//         });
//         if (!checkService) {
//           req.body.categoryId = categoryId;
//           const newService = await Service.create({
//             ...req.body,
//             specialistId: req.user.id,
//           });
//           res.status(201).json(newService);
//         } else {
//           const err = new Error("This service already exist in your salon");
//           err.status = 401;
//           res.json({ message: err.message });
//         }
//       } else {
//         const err = new Error("This categorey does not exist in this salon");
//         err.status = 400;
//         res.json({ message: err.message });
//       }
//     } catch (error) {
//       next(error);
//     }
//   };
