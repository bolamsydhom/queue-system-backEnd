var mongoose = require('mongoose');
const { schema } = require('./city');
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
    services: {
        type: [{
            type: String,
        }],
        required: true
    },
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