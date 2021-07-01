const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ConvosSchema = new Schema({
    body: String,
    username: String
});

module.exports = mongoose.model("Convo", ConvosSchema);