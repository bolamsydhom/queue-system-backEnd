var mongoose = require('mongoose');

const daysSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    }
})
const branchSchema = new mongoose.Schema({
    orgCode: {
        type: mongoose.ObjectId,
        ref: "Organization",
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    location: {
        type: String,
        required: true
    },
    workingDays: [daysSchema],

    services: {
        type: [{
            type: String,
        }],
        required: true
    },
    departments: {
        type: [{
            type: String,
        }],
        required: true
    }
}, {
    timestamps: true
})

schema.set('toJSON', {
    virtuals: true
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;