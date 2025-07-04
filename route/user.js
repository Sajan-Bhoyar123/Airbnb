
const express = require("express");
const { model, models } = require("mongoose");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");
const {saveurl,isloggedin,isowner,isauthor} = require("../middleware.js");
const userController = require("../controller/user.js");



router.route("/signup")
.get(userController.renderSignup)
.post(userController.signup);

router.route("/login")
.get(userController.renderLogin)
.post(saveurl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.Login );


router.get("/logout",userController.Loggout)
module.exports = router;