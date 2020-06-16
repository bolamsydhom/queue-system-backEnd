const express = require("express");
require("express-async-errors");

const Queues = require("../models/queue");

const router = express.Router();

router.post("/add", async (req, res, next) => {
  try {
    const { companyId, branchId, services, cityId } = req.body;
    const queue = new Queues({
      companyId,
      branchId,
      services,
      cityId,
    });
    await queue.save();
    res.status(200).json(` Entered successfully`);
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
});

// router.get('/number', async (req, res, next) => {
//     const queues = await Queues.find();
//     numberOfQ=queues.length;
//     // if (area.length == 0) {
//         //console.log(numberOfQ.length);
//     // }
//     res.status(200).json(numberOfQ);
// })

router.get("/virtualQ", async (req, res, next) => {
  const { companyId, branchId, services, cityId } = req.body;
  const virtualQueue = await Queues.filter({
    companyId: companyId,
    branchId: branchId,
    services: services,
    cityId: cityId,
    });

  var ActualDate = new Date(Date.now()).toString().substr(0, 15);

  const vir = virtualQueue.filter((queue) => {
    queue.createdAt.toString().substr(0, 15) === ActualDate;
  });

  const dateFromDB = new Date(branch[1].createdAt).toString().substr(0, 15);

  console.log("test:", dateFromDB);
  console.log("date:", ActualDate);
  console.log(branch[1].createdAt);

  if (dateFromDB === ActualDate) {
    console.log("successssss");
  }

  virtualQueue.custmors.push();
  res.status(200).json(vir);
});

router.patch("/addQnumber", async (req, res, next) => {
  const {
    companyId,
    brancdId,
    services,
    cityId,
    areaId,
    queueNumber,
  } = req.body;

  const queue = await Queues.find({
    companyId: companyId,
    brancdId: brancdId,
    services: services,
    cityId: cityId,
    areaId: areaId,
    queueNumber: queueNumber,
  });

  //const Qnumber = queue.length+1;

  await queue.update(req.body, { $set: { queueNumber: "5" } });
  res.status(200).json(Qnumber);

  //   const Updatedqueue =({
  //     companyId: companyId,
  //     brancdId: brancdId,
  //     services: services,
  //     cityId: cityId,
  //     areaId: areaId,
  //     queueNumber:Qnumber
  //   });
});

module.exports = router;
