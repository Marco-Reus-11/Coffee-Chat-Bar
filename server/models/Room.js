const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema({
    Nickname:String,
    Avatar:String
})

const roomSchema = new mongoose.Schema({
    RoomID:{type:Number,required:true},
    RoomName:{type:String,required:true},
    Members:memberSchema
})

module.exports = mongoose.model("Room",roomSchema)