var mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userID: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },

    brancdID: {
        type: mongoose.ObjectId,
        ref: 'Branch',
        required: true
    },
    deptID: {
        type: mongoose.ObjectId,
        ref: 'Department',
        required: true
    },
    queueNumber: {
        type: Number
    },

    estimatedTime: {
        type: Number,
        required: true
    },
    securityCode: {
        type: String,
        required: true
    },
    isDelayed: {
        type: Boolean
    },
    isNotShow: {
        type: Boolean
    },
    isCanceled: {
        type: Boolean
    },
    isRescheduled: {
        type: Boolean
    }
}, {
    timestamps: true
})


ticketSchema.set('toJSON', {
    virtuals: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;