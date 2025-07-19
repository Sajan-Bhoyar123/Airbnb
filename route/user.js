
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


router.get("/user/edit",isloggedin,wrapasync(async(req,res)=>{
    console.log("user id = ",req.user._id)
     let User = await  user.findById(req.user._id);
     console.log("Login User Data  = ",User);
     res.render("user/edit.ejs",{User});
}));


router.put('/users/:id',isloggedin, upload.single('image'), wrapasync(async (req, res) => {
    const User = await user.findById(req.params.id);
    let {username,email} = req.body
   if (req.file) {
        User.image = {
            url: req.file.path,
            filename: req.file.filename
        };
   }
    User.username = username;
    User.email = email; 
    await User.save();
   req.flash('success', 'Profile updated!');
   res.redirect('/login'); // or /profile page
}));

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

router.delete("/user/:id",isloggedin,wrapasync(async(req,res)=>{
    let {id} = req.params;
    console.log(id);
    const booking = await Booking.findByIdAndDelete(id);
    console.log(booking);
    res.redirect("/user/bookedproperty");
}));


router.get("/logout",userController.Loggout)
module.exports = router;