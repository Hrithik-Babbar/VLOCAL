const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
const UserSchema = new Schema({});
UserSchema.plugin(passportLocalMongoose);
//it add on fiels for password username ensure uniqueness etc.
module.exports = mongoose.model('User', UserSchema);