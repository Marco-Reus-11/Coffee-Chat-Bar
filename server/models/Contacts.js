const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    friendAvatar:String,
    friendName:String,
    friendNickname:String
})

module.exports = mongoose.model('Contacts',contactSchema)