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
var departmentSchema = new mongoose.Schema({
    orgCode: {
        type: mongoose.ObjectId,
        ref: 'Organization',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    services: {
        type: [{
            type: String,
        }],
        required: true
    },
    workingDays: [daysSchema],
}, {
    timestamps: true
})

schema.set('toJSON', {
    virtuals: true
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;