const express = require("express");
require("express-async-errors");

const VirtualQueues = require("../models/queue");

const router = express.Router();

router.post("/add", async (req, res, next) => {
  try {
    const { customers, companyId, branchId, services, cityId } = req.body;
    const queue = new VirtualQueues({
      customers,
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

router.get("/getQ", async (req, res, next) => {
  const { userId, companyId, branchId, services, cityId } = req.body;

  const virtualQueue = await VirtualQueues.find({
    companyId: companyId,
    branchId: branchId,
    services: services,
    cityId: cityId,
  });

  const actualDate = new Date(Date.now()).toString().substr(0, 15);

  let vir = virtualQueue.filter((queue) => {
    if (queue.createdAt.toString().substr(0, 15) === actualDate) {
      return queue;
    }
  });

  if (vir.length === 0 && Object.keys(req.query).length === 0) {
    console.log("no Queryy");

    const newvirtualCustmor = {
      userId,
      queueNumber: 1,
      isActual: false,
    };
    const newvirtualQ = new VirtualQueues({
      customers: newvirtualCustmor,
      userId,
      companyId,
      branchId,
      services,
      cityId,
    });
    await newvirtualQ.save();
    vir = newvirtualQ;
  }
  if (vir.length === 0 && Object.keys(req.query).length !== 0) {
    console.log("Queryy");

    const newvirtualCustmor = {
      userId,
      queueNumber: 1,
      isActual: true,
    };
    const newvirtualQ = new VirtualQueues({
      customers: newvirtualCustmor,
      userId,
      companyId,
      branchId,
      services,
      cityId,
    });
    await newvirtualQ.save();
    vir = newvirtualQ;
  }

  if (vir.length === undefined) {
    let lastNoInVir = vir.customers.slice(-1)[0].queueNumber;
    console.log(lastNoInVir);
    nextQ = lastNoInVir + 1;
    console.log(nextQ);
  }

  if (vir.length === 1 && Object.keys(req.query).length === 0) {
    let lastNoInVir = vir[0].customers.slice(-1)[0].queueNumber;
    console.log(lastNoInVir);
    nextQ = lastNoInVir + 1;
    console.log(nextQ);
    let virClone = vir;
    const newCustmor = {
      userId,
      queueNumber: nextQ,
      isActual: false,
    };
    virClone[0].customers.push(newCustmor);
    await VirtualQueues.update(
      {
        _id: vir[0].id,
      },
      { $addToSet: { customers: newCustmor } }
    );
  }

  if (vir.length === 1 && Object.keys(req.query).length !== 0) {
    let lastNoInVir = vir[0].customers.slice(-1)[0].queueNumber;
    console.log(lastNoInVir);
    nextQ = lastNoInVir + 1;
    console.log(nextQ);
    let virClone = vir;
    const newCustmor = {
      userId,
      queueNumber: nextQ,
      isActual: true,
    };
    virClone[0].customers.push(newCustmor);
    await VirtualQueues.update(
      {
        _id: vir[0].id,
      },
      { $addToSet: { customers: newCustmor } }
    );
  }

  res.status(200).json(vir);
});

router.get("/actualQ", async (req, res, next) => {
  const { userId, companyId, branchId, services, cityId } = req.body;

  const virtualQueue = await VirtualQueues.find({
    companyId: companyId,
    branchId: branchId,
    services: services,
    cityId: cityId,
  });

  const actualDate = new Date(Date.now()).toString().substr(0, 15);

  let vir = virtualQueue.filter((queue) => {
    if (queue.createdAt.toString().substr(0, 15) === actualDate) {
      return queue;
    }
  });

  const user = vir[0].customers.map((x) => x.queueNumber===5)
  

  console.log(user)


  res.status(200).json(vir);
});

module.exports = router;
