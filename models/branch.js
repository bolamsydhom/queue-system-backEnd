var mongoose = require('mongoose');

const daysSchema = new mongoose.Schema({
    day: {
        type: String,
        // required: true
    },
    openShift: {
        type: {
            time: {
                type: Date
            }
        },
        // required: true
    },
    endShift: {
        type: {
            time: {
                type: Date
            }
        },
        // required: true
    }


})
const branchSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.ObjectId,
        ref: "Organization",
        required: true
    },
    branchName: {
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
    }
    // departments: {
    //     type: [{
    //         type: String,
    //     }],
    //     required: true
    // }
}, {
    timestamps: true
})

schema.set('toJSON', {
    virtuals: true
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;