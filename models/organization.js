var mongoose = require('mongoose');
const { schema } = require('./city');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }


})

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    locations: {
        type: [{
            type: mongoose.ObjectId,
            ref: 'City',
            required: true
        }]
    },
    services:[serviceSchema],
    
    imgUrl: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

schema.set('toJSON', {
    virtuals: true
});



const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;