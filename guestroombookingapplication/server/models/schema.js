const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name:String,
    mobileNumber:String,
    email:String,
    password:String,
    userType:String
}) 

const signupDetails = mongoose.model('signupDetails', roomSchema);


module.exports = signupDetails
