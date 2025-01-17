const express = require('express');
require('express-async-errors');

const Cities = require('../models/city');
const Areas = require('../models/area');

const router = express.Router();



router.get('/', async (req, res, next) => {
    const city = await Cities.find();
    res.status(200).json(city);
})

router.get('/:id',async(req,res,next)=>{
    const{id}=req.params
    const city= await Cities.findById(id)
    res.status(200).json(city);

})

router.get('/area', async (req, res, next) => {
    const area = await Areas.find();
    res.status(200).json(area);
})

router.post('/add', async (req, res, next) => {
    try {
        const {
            name
        } = req.body;
        const city = new Cities({
            name
        });
        await city.save();
        res.status(200).json(` Entered successfully`);
    } catch (err) {
        err.statusCode = 422;
        next(err);
    }
})


router.post('/area/add', async (req, res, next) => {
    try {
        const {
            name,
            cityId
        } = req.body;
        const area = new Areas({
            name,
            cityId
        });
        await area.save();
        res.status(200).json(` Entered successfully`);
    } catch (err) {
        err.statusCode = 422;
        next(err);
    }

})


router.get('/area/:id', async (req, res, next) => {
    const {
        id
    } = req.params;

     const areas = await Areas.find({
        cityId: id
     })
   
  res.status(200).json(areas);

})
module.exports = router;