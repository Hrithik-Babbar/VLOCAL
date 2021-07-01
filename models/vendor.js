const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VendorSchema = new Schema({
    username: String,
    title: String,
    service: String,
    location: String,
    image: String,
});
module.exports = mongoose.model('Vendor', VendorSchema);