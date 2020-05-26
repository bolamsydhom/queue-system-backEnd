const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require("cloudinary").v2;

require('express-async-errors');

const Tickets = require('../models/ticket');
const authnticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleWare = require('../middlewares/authorization');

const parser = require("../middlewares/cloudinary");

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


router.post('/test', async (req, res, next) => {
    try {

        const {
            photo
        } = req.files;
        // console.log(req.files)
        // console.log(req);
        // const image = {};
        // image.url = req.files.url;
        // image.id = req.files.public_id;
        // parser.create(image) // save image information in database
        //     .then(newImage => res.json(newImage))
        //     .catch(err => console.log(err));

        cloudinary.uploader.upload(photo.tempFilePath, (err, result) => {
            console.log(result);
        res.status(200).json(result.url);

        })
        // await ticket.save();
        // res.status(200).json(image);
    } catch (err) {
        next(err);
    }
})




router.post('/add', authnticationMiddleware,  async (req, res, next) => {
    try {

        const {
            discount,
            price,
            imagesUrls,
            data,
            categoryId
        } = req.body;
        const userID = req.user.id;
        const ticket = new Tickets({
            userID,
            discount,
            price,
            imagesUrls,
            data,
            categoryId,
            // createdAt: new Date()
        });

        await ticket.save();
        res.status(200).json(` ${ticket.data[0].name} added with ${ticket.data[0].description} and ${ticket}`);
    } catch (err) {
        next(err);
    }
})

router.get('/', async (req, res, next) => {

    const {
        limit,
        skip,
        sortBy,
        sdir
    } = req.query;

    var sortObject = {};
    sortObject[sortBy] = sdir;


    const ticket = limit & sortBy ? await Tickets.find().limit(+limit).skip(+skip).sort(sortObject) :
        sortBy ? await Tickets.find().sort(sortObject) :
        limit ? await Tickets.find().limit(+limit).skip(+skip) :
        await Tickets.find();

    const numberOfProducts = await Tickets.count();
    // const ticket = await Tickets.find().limit(limit ? +limit : 9).skip(skip ? +skip : 0);
    res.status(200).json({
        ticket: ticket,
        numberOfProducts: numberOfProducts
    });
    // res.status(200).json(ticket
    //     // numberOfPages: Math.ceil(numberOfPages)
    // );

})


router.patch('/:id', authnticationMiddleware, authorizationMiddleWare, async (req, res, next) => {

    const {
        id
    } = req.params;
    const userId = req.user.id;
    const ticket = await Tickets.findById(id);
    await ticket.update(req.body, {
        new: true,
        runValidators: true,
        omitUndefined: true
    })
    res.status(200).json(`${ticket}updated Successfuly`);


})


router.get('/:id', async (req, res, next) => {

    const {
        id
    } = req.params;
    const ticket = await Tickets.findById(id);

    res.status(200).json(ticket);


})

router.delete('/:id', authnticationMiddleware, authorizationMiddleWare, async (req, res, next) => {

    const userId = req.user.id;
    const ticket = await Tickets.findById(req.params.id);
    await Tickets.deleteOne(ticket);
    res.status(200).json("Deleted Successfuly");


})


module.exports = router;