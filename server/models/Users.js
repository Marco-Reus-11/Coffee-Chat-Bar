const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    uID:String,
    uAvatar: String,
    uName: String,
    Password: String,
    Friends: Object
})

module.exports = mongoose.model("Users",userSchema)