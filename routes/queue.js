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

      const newCst =
        actual ? {
          queueNumber: 1,
          isActual: true,
        } : {
          userId,
          queueNumber: 1,
          isActual: false,
          securityCode
        };
      const securityCodes = actual ? [] : [securityCode];

      const queue = new VirtualQueues({
        customers: newCst,
        userId,
        companyId,
        branchId,
        service,
        cityId,
        securityCodes
      });
      await queue.save();

      const resp = actual ? newCst : {
        companyId,
        branchId,
        service,
        cityId,
        newCst,
        estimaedTime: 1
      };
      res.status(200).json(resp);
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

      const exist = actual ? [] : virtualQueue[0].customers.filter(customer =>
        customer.userId == userId
      )

      console.log(exist);

      let respon;

      if (exist.length === 0) {

        if (!actual) {
          const newCst = {
            userId,
            queueNumber: nextQ,
            isActual: false,
            securityCode
          };

          virClone[0].customers.push(newCst);
          virtualQueue[0].securityCodes.push(securityCode);
          respon = {
            companyId,
            branchId,
            service,
            cityId,
            newCst,
            estimaedTime: (nextQ - 1) * 10
          };
          await VirtualQueues.updateMany({
            _id: virtualQueue[0].id,
          }, {
            $addToSet: {
              customers: newCst,
              securityCodes: securityCode
            }
          });

        } else {
          const newCst = {
            queueNumber: nextQ,
            isActual: true,
          };
          virClone[0].customers.push(newCst);
          respon = newCst;

          await VirtualQueues.update({
            _id: virtualQueue[0].id,
          }, {
            $addToSet: {
              customers: newCst
            }
          });
        }





        res.status(200).json(respon);
      } else throw new Error('ooh! you seems to have a ticket here already')
    }
  } catch (error) {
    next(error);
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