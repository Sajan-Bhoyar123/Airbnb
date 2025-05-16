const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/list.js");
const wrapasync = require("../util/wrapasync.js");
const ExpressError = require("../util/express.js");
const review = require("../models/review.js");
const {saveurl,isloggedin,isowner,isauthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");


//  insert review route
router.post("/",isloggedin,wrapasync(reviewController.constructorReview));

 // delete review route
router.delete("/:reviewid",isloggedin,isauthor,wrapasync(reviewController.destructorReview));
router.get("/:reviewid",reviewController.RedirectRoute);
module.exports = router;