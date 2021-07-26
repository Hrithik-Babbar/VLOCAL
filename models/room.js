const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Convo = require('./convo');
const RoomSchema = new Schema({
    title: String,
    vendorname: String,
    username: String,
    convos: [{
        type: Schema.Types.ObjectId,
        ref: 'Convo'
    }]

});
RoomSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Convo.deleteMany({
            _id: {
                $in: doc.convos
            }
        })
    }
})
module.exports = mongoose.model('Room', RoomSchema);