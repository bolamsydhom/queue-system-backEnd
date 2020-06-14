const express = require("express");
require("express-async-errors");


const Branchs = require("../models/branch");
const Days = require("../models/branch");

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
  const { id } = req.params;

  const branch = await Branchs.find({
    cityId: id,
  });

  res.status(200).json(branch);
});

router.get("/area/:id", async (req, res, next) => {
  const { id } = req.params;

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
  const { id } = req.params;

  const branch = await Branchs.findById(id);
const service = Object.values(branch.services)

  res.status(200).json(service);
});


router.get("/branch", async (req, res, next) => {
 //console.log(req.query)


const cityid = req.query.cityid;
 const companyid = req.query.companyid;

 const branch = await Branchs.find({
   cityId: cityid, 
   companyId: companyid
  });

  res.status(200).json(branch);
});

router.get("/branchs", async (req, res, next) => {
  //console.log(req.query)
 
 
 const areaid = req.query.areaid;
  const companyid = req.query.companyid;
 
  const branch = await Branchs.find({
    areaId: areaid, 
    companyId: companyid
   });
 
   res.status(200).json(branch);
 });

module.exports = router;
