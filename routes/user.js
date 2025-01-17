const express = require('express');
const Users = require('../models/user');
const Tickets = require('../models/ticket');
const authnticationMiddleware = require('../middlewares/authentication');
const router = express.Router();

const parser = require("../middlewares/cloudinary");
const fileUpload = require('express-fileupload');
const emailverfication = require('../middlewares/emailverfication');
const cloudinary = require("cloudinary").v2;

var messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//get area by city id///////////////

/**
 * @swagger
 * /user/upload-image:
 *   post:
 *     summary: This should upload user's image.
 *     description: This is api to upload user's image.
 *     consumes:
 *       — application/json
 *     parameters:
 *      - in: files
 *        name: photo
 *        schema:
 *            type: object
 *        properties:
 *           email:
 *           password:
 *           type: string
 *     responses: 
 *       200:
 *         description: logged in successfully .
 */


router.post('/upload-image', async (req, res, next) => {
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



router.get('/', authnticationMiddleware, async (req, res, next) => {
    try {
        const users = await Users.find({}, {
            firstName: 1,
            _id: 0

        });
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
})

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: This should login existing user.
 *     description: This is api to login.
 *     consumes:
 *       — application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *            type: object
 *            required:
 *               -userName
 *            properties:
 *               email:
 *                 type: Email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               repeated password:
 *                 type: string
 *               phone number:
 *                 type: Number
 *     responses: 
 *       200:
 *         description: logged in successfully .
 */


router.post('/register', async (req, res, next) => {
    try {

        const {
            email,
            password,
            repeatedPassword,
            orgCode,
            deptID,
            branchCode,
            firstName,
            lastName,
            phoneNumber

        } = req.body;


        const user = orgCode ? new Users({
                email,
                password,
                orgCode,
                firstName,
                lastName,
                phoneNumber,
                deptID,
                branchCode,
                isAdmin: true,
                isEmployee: true
            }) :
            new Users({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                isAdmin: false,
                isEmployee: false


            });
        if (password !== repeatedPassword) {

            throw new Error('Password didnot Match');
        }
        await user.save();
        res.status(200).json(`succssess`);
        // return res.redirect('http://localhost:3000/ticket');
    } catch (err) {
        err.statusCode = 422;
        next(err);
    }

})


router.post('/generateCode', async (req, res, next) => {
    const {
        phone
    } = req.body;
    console.log(phone);
    
    messagebird.verify.create(phone, {
            originator: 'Code',
            template: 'your verfication code for Q : %token'
        },
        function (err, response) {
            if (err) {
                console.log(err);
                next(err)
            } else {
                res.status(200).json(response);

                console.log(response);

            }
        });
});


router.post('/verifyCode', async (req, res, next) => {
    const {
        id , token
    } = req.body;
    messagebird.verify.verify(id, token, function (err, response) {
            if (err) {
                console.log(err);
                next(err)
            } else {
                res.status(200).json(response);

                console.log(response);

            }
        });
});



router.post('/email', emailverfication, async (req, res, next) => {
    if (!req.body.email) {
        res.status(422).send(`email is required`);
    } else {
        try {
            const {
                validEmail,
            } = req;
            // const person = await Users.findOne({
            //     email
            // });
            if (validEmail) res.status(200).json('valid Email');

        } catch (err) {
            console.log(error);
            // err.statusCode = 422;
            next(err);
        }
    }




})





/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: This should login existing user.
 *     description: This is api to login.
 *     consumes:
 *       — application/json
 *     parameters:
 *       — name: body
 *       in: body
 *       schema:
 *         type: object
 *         properties:
 *           email:
 *           password:
 *           type: string
 *     responses: 
 *       200:
 *         description: logged in successfully .
 */


router.post('/login', async (req, res, next) => {


    if (!req.body.email || !req.body.password) {
        res.status(422).send(`${!req.body.email? 'email' : 'password' } is required`);


    } else {
        try {
            const {
                email,
                password
            } = req.body;
            const person = await Users.findOne({
                email
            });
            // .populate('tickets').exec();
            if (!person) {
                throw new Error('Try Again!! wrong email or password')
            } else {
                const isValidPerson = await person.comparePassword(password);
                if (isValidPerson) {
                    const token = await person.generateToken();
                    res.status(200).json({
                        person,
                        token
                    });
                } else {
                    throw new Error('Try Again!! wrong email or password')
                }
            }
        } catch (err) {
            err.statusCode = 422;
            next(err);
        }

    }




})


router.delete('/', authnticationMiddleware, async (req, res, next) => {
    try {
        await Users.findByIdAndRemove({
            _id: req.user.id
        });
        res.status(200).json("Deleted Successfuly");
    } catch (err) {
        next(err);
    }
})



router.patch('/', authnticationMiddleware, async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await Users.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            omitUndefined: true
        });
        res.status(200).json(`${user}updated Successfuly`);
    } catch (err) {
        next(err);
    }
})

module.exports = router;