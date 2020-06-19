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

  //  branchesClone = branches;
  const actualDate = new Date(Date.now()).toString().substr(0, 15);
  let smallestNumberOfCsts = 0;

   recommendedBranchId = branches.map(async (branch) => {
    const queues = await Queues.find({
      companyId: companyid,
      branchId: branch._id,
      cityId: cityid,
    });
   let brchId =  queues.filter((queue) => {
      let recBranchId
      if (queue.createdAt.toString().substr(0, 15) === actualDate) {

        if (smallestNumberOfCsts === 0) {
          smallestNumberOfCsts = queue.customers.length;
          recBranchId = queue.branchId;

        } else if (queue.customers.length < smallestNumberOfCsts) {
          smallestNumberOfCsts = queue.customers.length;
          recBranchId = queue.branchId;
          branch.isRecommended = true
        }
        // return {
        //   recommendedBranchId,
        //   smallestNumberOfCsts
        // };
        return recBranchId;
      }
    });
    console.log(brchId);
    
    return brchId;
  var branchesClone = [];
    branchesClone.push(branch)
    console.log(branchesClone);
  })

  // var test = await branches.find({
  //   _id: toString(recommendedBranchId)
  // });
console.log(recommendedBranchId);





  // res.status(200).json(branchesClone);
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