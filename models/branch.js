var mongoose = require('mongoose');

const daysSchema = new mongoose.Schema({
    day: {
        type: String,
        // required: true
    },
    openShift: {
        type: Number,
        // required: true
        min:0,max:24
    },
    endShift: {
        type: Number,
        min:0,max:24

        // required: true
    }


})
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    cityId: {
            type: mongoose.ObjectId,
            ref: 'City',
            required: true
        
    },
    workingDays: [daysSchema],

    services:[serviceSchema],
    
    areaId:{
        type: mongoose.ObjectId,
        ref:'Area',
        required:true
    },
    isRecommended:{
        type: Boolean
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

branchSchema.set('toJSON', {
    virtuals: true
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;