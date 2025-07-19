
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const user = require("../models/user.js");
const Listing = require("../models/list.js");
const Booking = require("../models/booking.js");
const passport = require("passport");
const wrapasync = require("../util/wrapasync.js");
const {saveurl,isloggedin,isowner,isauthor} = require("../middleware.js");
const userController = require("../controller/user.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage })

router.route("/signup")
.get(userController.renderSignup)
.post(upload.single('image'),userController.signup);

router.route("/login")
.get(userController.renderLogin)
.post(saveurl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.Login );

router.get("/user/property", isloggedin, wrapasync(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id); // Ensure ObjectId
    const datas = await Listing.find({ owner: userId }).populate("owner");
    console.log("Logged in user:", req.user.username);
    console.log("Found properties:", datas);
    if(datas.length<1){
       req.flash("error","NOT Any Property Created By You");
       res.redirect("/listing");
    }else{
       res.render("listing/index.ejs",{datas});
    }

}));
router.get("/user/bookedproperty", isloggedin, wrapasync(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("property"); // populate the booked property details
    if(bookings.length<1){
        req.flash("error","You NOT Booked Any Property till Now");
        res.redirect("/listing");
    }else{
       res.render("user/bookedProperties", { bookings });
    }
}));


router.get("/logout",userController.Loggout)
module.exports = router;