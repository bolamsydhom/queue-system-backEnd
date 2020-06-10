var mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }

})


schema.set('toJSON', {
    virtuals: true
});


const City = mongoose.model('City', schema);

module.exports = City;