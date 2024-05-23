const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  roomName: String,
  checkIn: String ,
  checkOut:String,
  roomType:String// Assuming the file is stored as a string (file path or URL)
});
const Booking = mongoose.model('Booking', roomSchema);

  module.exports = Booking