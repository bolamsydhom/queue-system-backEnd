const express = require('express');


require('express-async-errors');

const Tickets = require('../models/ticket');
const authnticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleWare = require('../middlewares/authorization');


const router = express.Router();


const http = require('http').createServer(express);
const io = require('socket.io')(http);


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

router.get('/waiting', async (req, res, next) => {

    // const {
    //     id
    // } = req.params;
    // const ticket = await Tickets.findById(id);

    // res.status(200).json(ticket);
    res.status(200).json('done');
    // console.log('dfdfddf');

})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('my message', (msg) => {
        console.log('message: ' + msg);
    });
});


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