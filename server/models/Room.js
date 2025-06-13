const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    RoomID:{type:Number,required:true,unique:true},
    RoomName:{type:String,required:true},
    Members:[{
        Nickname:String,
        Avatar:String,
        userID:String
    }]
})

module.exports = mongoose.model("Room",roomSchema)