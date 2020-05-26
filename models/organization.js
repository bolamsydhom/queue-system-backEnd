var mongoose = require('mongoose');
const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    services: {
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



const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;