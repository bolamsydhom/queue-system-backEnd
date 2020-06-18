const express = require("express");
require("express-async-errors");

const VirtualQueues = require("../models/queue");

const router = express.Router();

router.post("/add", async (req, res, next) => {
  try {
    const {
      customers,
      companyId,
      branchId,
      services,
      cityId
    } = req.body;
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

router.post("/book", async (req, res, next) => {
  const {
    userId,
    companyId,
    branchId,
    service,
    cityId
  } = req.body;
  const {
    actual
  } = req.query;

  try {
    const virtualQueues = await VirtualQueues.find({
      companyId: companyId,
      branchId: branchId,
      service: service,
      cityId: cityId,
    });

    const actualDate = new Date(Date.now()).toString().substr(0, 15);


    let virtualQueue = virtualQueues.filter((queue) => {
      if (queue.createdAt.toString().substr(0, 15) === actualDate) {
        return queue;
      }
    });
    let securityCode = Math.floor(Math.random() * 1000) + 1;



    if (virtualQueue.length === 0) {

      const newvirtualCustmor =
        actual ? {
          queueNumber: 1,
          isActual: true,
        } : {
          userId,
          queueNumber: 1,
          isActual: false,
          securityCode
        };
      const securityCodes = actual? []: [securityCode];

      const queue = new VirtualQueues({
        customers: newvirtualCustmor,
        userId,
        companyId,
        branchId,
        service,
        cityId,
        securityCodes
      });
      await queue.save();
      res.status(200).json(queue);
    }
    //  else if (virtualQueue.length === undefined) {
    //   let lastNoInVir = virtualQueue.customers.slice(-1)[0].queueNumber;
    //   console.log(lastNoInVir);
    //   nextQ = lastNoInVir + 1;
    //   console.log(nextQ);
    // }  
    else if (virtualQueue.length === 1) {
      let lastNoInVir = virtualQueue[0].customers.slice(-1)[0].queueNumber;
      console.log(lastNoInVir);
      nextQ = lastNoInVir + 1;
      console.log(nextQ);
      let virClone = virtualQueue;

      for (let index = 0; index < virtualQueue[0].securityCodes.length; index++) {
        if (virtualQueue[0].securityCodes[index] === securityCode) {
          securityCode = Math.floor(Math.random() * 1000) + 1;
          index = 0;
        }
      }
      if(!actual) virtualQueue[0].securityCodes.push(securityCode);

     const exist = virtualQueue[0].customers.filter( customer =>
      customer.userId == userId
      )
      console.log(exist);
      
      if(exist.length === 0){

      const newCustmor =
        actual ? {
          queueNumber: nextQ,
          isActual: true,
        } : {
          userId,
          queueNumber: nextQ,
          isActual: false,
          securityCode
        };
      virClone[0].customers.push(newCustmor);
      await VirtualQueues.update({
        _id: virtualQueue[0].id,
      }, {
        $addToSet: {
          customers: newCustmor
        }
      });

      res.status(200).json(virClone);
      }else throw new Error('user has already booked a ticket here')
    }
  } catch (error) {
    const err = new Error('ooh! you seems to have a ticket here already');
    next(err);
  }


});

// router.get("/actualQ", async (req, res, next) => {
//   const { userId, companyId, branchId, services, cityId } = req.body;

//   const virtualQueue = await VirtualQueues.find({
//     companyId: companyId,
//     branchId: branchId,
//     services: services,
//     cityId: cityId,
//   });

//   const actualDate = new Date(Date.now()).toString().substr(0, 15);

//   let virtualQueue = virtualQueue.filter((queue) => {
//     if (queue.createdAt.toString().substr(0, 15) === actualDate) {
//       return queue;
//     }
//   });

//   const user = virtualQueue[0].customers.map((x) => x.queueNumber===5)


//   console.log(user)


//   res.status(200).json(virtualQueue);
// });

module.exports = router;