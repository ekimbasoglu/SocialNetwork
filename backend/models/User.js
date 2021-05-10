const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    friends: { type: [Number] },
    id: { type: Number},
    firstName: { type: String},
    surname: { type : String},
    age : { type : Number},
    gender : { type: String},
});

module.exports = mongoose.model('user', UserSchema);
