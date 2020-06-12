const Users = require('../models/user');
const customeError = require('../helpers/customeError');


module.exports = async (req, res, next) => {

    const email = req.body.email;
    // req.body;
    const person = await Users.findOne({
        email
    });
    if (!person) {const err = customeError(401, 'Email Not Found !!'); next(err)}

    req.validEmail = person;
    next();

}