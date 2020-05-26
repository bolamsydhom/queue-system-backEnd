var mongoose = require('mongoose');
require('mongoose-type-email');

const bcrypt = require('bcrypt');
const util = require('util');
const jwt = require('jsonwebtoken');

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify)
const jwtSercret = process.env.jwt;


const userSchema = new mongoose.Schema({
    deptID: {
        type: mongoose.ObjectId,
        ref: 'Department',
        required: true
    },
    orgCode: {
        type: mongoose.ObjectId,
        ref: 'Organization',
        required: true
    },
    branchCode: {
        type: mongoose.ObjectId,
        ref: 'Branch',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    locations: {
        type: [String],
        required: true
    },
    profilePic: {
        type: String,
    }


});

schema.set('toJSON', {
    virtuals: true,
    transform: doc => {
        return _.pick(doc, ["email", "password"])
    }
});
schema.virtual('tickets', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'userID'
})

schema.pre('save', async function () {
    const userInstance = this;
    if (this.isModified('password')) {
        userInstance.password = await bcrypt.hash(userInstance.password, 7)
    }
});


schema.statics.getUserfromToken = async function (token) {
    const User = this;
    const payload = await verify(token, jwtSercret);
    const currentUser = await User.findById(payload.currentUserId);
    if (!currentUser) throw new Error('user not found');
    return currentUser;
}


schema.methods.generateToken = function (expiresIn = '30m') {
    const userInstance = this;
    return sign({ currentUserId: userInstance.id }, jwtSercret, { expiresIn })
};


schema.methods.comparePassword = function (myPlainText) {
    const userInstance = this;
    return bcrypt.compare(myPlainText, userInstance.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;