const express = require('express');
require('express-async-errors');


const Organizations = require('../models/organization');

const router= express.Router();

router.get('/',async(req,res,next)=>{
    const organization= await Organizations.find();
    res.status(200).json(organization);
})

router.get('/:id',async(req,res,next)=>{
    const{
        id
    }=req.params;
    const organization= await Organizations.findById(id);

    res.status(200).json(organization);
})

router.post('/add',async(req,res,next)=>{
try{
    const{
        name,
        locations,
        services,
        imgUrl
    }=req.body;
    const organization = new Organizations({
        name,
        locations,
        services,
        imgUrl
    });
    await organization.save();
    res.status(200).json(`the organization added Successfully !`)
}catch (err){
 err.statusCode=422;
 next(err);
}
})

router.get("/city/:id",async(req,res,next)=>{
    const{
        id
    }=req.params

    const organization=await Organizations.find({
        locations:id
    })

    res.status(200).json(organization);
})

module.exports=router;