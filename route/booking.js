const express = require("express");
const router = express.Router();
const Listing = require("../models/list.js");
const wrapasync = require("../util/wrapasync.js");
const expressError = require("../util/express.js");
 const {saveurl,isloggedin,isowner,isauthor}= require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })
const Booking = require("../models/booking.js");

router.post('/:id', isloggedin, wrapasync(async (req, res) => {
    let {id} = req.params;
  const listing = await Listing.findById(req.params.id);
  const { nights, totalPrice } = req.body;
 const bookedproperty =  await Booking.create({
    property: listing._id,
    user: req.user._id,
    nights,
    totalPrice
  });
  req.flash('success', 'Booking Confirmed! Payment done via QR.');
  res.redirect(`/listing/${id}`);
}));

module.exports = router;
