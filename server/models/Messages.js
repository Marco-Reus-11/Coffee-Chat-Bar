const mongoose = require("mongoose")

const msgSchema = new mongoose.Schema({
    from:String,
    to:String,
    time:Date,
    content:String,
})

module.exports = mongoose.model('Msg',msgSchema)