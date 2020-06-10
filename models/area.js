var mongoose = require('mongoose');
const schema = new mongoose.Schema({
    cityID: {
        type: mongoose.ObjectId,
        ref: 'City',
        required: true
    },
    name: {
        type: String,
        required: true
    }

})


schema.set('toJSON', {
    virtuals: true
});




const Area = mongoose.model('Area', schema);

module.exports = Area;