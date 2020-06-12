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
      locations,
      workingDays,
      services,
      areaId,
    } = req.body;
    const branch = new Branchs({
      companyId,
      branchName,
      locations,
      workingDays,
      services,
      areaId,
    });
    await branch.save();
    res.status(200).json(`the organization added Successfully !`);
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
});

router.get('/',async(req,res,next)=>{
  const branch = await Branchs.find();
  res.status(200).json(branch)
})

router.get("/city/:id",async(req,res,next)=>{
  const{
      id
  }=req.params

  const branch=await Branchs.find({
      locations:id
  })

  res.status(200).json(branch);
})

router.get("/area/:id", async (req, res, next) => {
  const { id } = req.params;

  const branch = await Branchs.find({
    areaId: id,
  });
  res.status(200).json(branch);
});

module.exports = router;
