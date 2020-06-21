const express = require("express");
require("express-async-errors");

const Branchs = require("../models/branch");
const Days = require("../models/branch");
const Queues = require("../models/queue");


const router = express.Router();

router.post("/add", async (req, res, next) => {
  try {
    const {
      companyId,
      branchName,
      cityId,
      workingDays,
      services,
      areaId,
    } = req.body;
    const branch = new Branchs({
      companyId,
      branchName,
      cityId,
      workingDays,
      services,
      areaId,
      isRecommended: false
    });
    await branch.save();
    res.status(200).json(`the Branch added Successfully !`);
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
});

// router.get("/", async (req, res, next) => {
//   const branch = await Branchs.find();
//   res.status(200).json(branch);
// });

router.get("/city/:id", async (req, res, next) => {
  const {
    id
  } = req.params;


  const branchs = await Branchs.find({
    cityId: id,
  });



  res.status(200).json(branchs);
});

router.get("/area/:id", async (req, res, next) => {
  const {
    id
  } = req.params;

  const branch = await Branchs.find({
    areaId: id,
  });
  res.status(200).json(branch);
});

// router.get("/:id", async (req, res, next) => {
//   const { id } = req.params;
//   const branch = await Branchs.findById(id);

//   res.status(200).json(branch);
// });

router.get("/service/:id", async (req, res, next) => {
  const {
    id
  } = req.params;

  const branch = await Branchs.findById(id);
  const service = Object.values(branch.services);

  res.status(200).json(service);
});

router.get("/branch", async (req, res, next) => {
  //console.log(req.query)

  const cityid = req.query.cityid;
  const companyid = req.query.companyid;

  const branches = await Branchs.find({
    cityId: cityid,
    companyId: companyid,
  });

  const queues = await Queues.find({
    companyId: companyid,
    cityId: cityid,
  });

  if (queues.length > 0) {
    const actualDate = new Date(Date.now()).toString().substr(0, 15);
    let todayQueue = queues.filter((queue) => {
      if (queue.createdAt.toString().substr(0, 15) === actualDate) {
        return queue;
      }
    });
    // console.log(todayQueue)

    if (todayQueue.length > 0) {
      let smallestNumberOfCsts = 0;
      let obj = [];
      for (let index = 0; index < todayQueue.length; index++) {

        let num = 0;
        let bId;
        for (let j = 1; j < todayQueue.length; j++) {
          if (todayQueue[index].branchId == todayQueue[j].branchId) {
            num = num + todayQueue[j].customers.length;
            bId = todayQueue[j].branchId
          }

        }
        obj.push({
          bId,
          num
        })

        // if (smallestNumberOfCsts === 0 || todayQueue[index].customers.length < smallestNumberOfCsts) {
        //   smallestNumberOfCsts = todayQueue[index].customers.length;
        //   brnchId = todayQueue[index].branchId;
        // }
      }
      // console.log("smallestNumberOfCsts  ", smallestNumberOfCsts);
      // console.log("brnch ID  ", brnchId);


      console.log(obj);
      var brnchId;
      for (let i = 2; i < obj.length; i++) {
        if (obj[i - 1].num > obj[i].num) {
          brnchId = obj[i].bId;
        }
        console.log(brnchId);
      }

      if (branchId) {
        let branchesClone = branches.map(branch => {
          // console.log(branch._id.toString());

          // console.log(branch._id.toString() === brnchId.toString());

          if (branch._id.toString() === brnchId.toString()) {
            branch.isRecommended = true;
          }
          return branch;
        })
        console.log(branchesClone);
        res.status(200).json(branchesClone);

      }
    }

  } else {

    res.status(200).json(branches);

  }








});

router.get("/recommendedBranchs", async (req, res, next) => {
  //console.log(req.query)

  const cityid = req.query.cityid;
  const areaid = req.query.areaid;
  const companyid = req.query.companyid;

  const branch = await Branchs.find({
    cityId: cityid,
    companyId: companyid,
    areaId: areaid,
  });

  res.status(200).json(branch);
});

module.exports = router;