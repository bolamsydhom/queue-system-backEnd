const Tickets = require('../models/ticket');
const customeError = require('../helpers/customeError');

module.exports = async (req, res, next) => {


        const {params:{id: productId}, user:{id: userId}}=req;
        const ticket = await Tickets.findById(productId);
        if(!ticket.userID.equals(userId)) throw customeError(403,'Not Authorized')
        req.isAuth = true;
        next();

}