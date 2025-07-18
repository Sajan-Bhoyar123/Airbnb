// models/booking.js
const  listing = require("./list.js");
const review = require("./review.js");
const user = require("./user.js");
const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'listing'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  nights: Number,
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Booking', bookingSchema);
