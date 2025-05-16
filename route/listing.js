const express = require("express");
const router = express.Router();
const Listing = require("../models/list.js");
const wrapasync = require("../util/wrapasync.js");
const ExpressError = require("../util/express.js");
const {listingschema} = require("../schema.js");
const {saveurl,isloggedin,isowner,isauthor} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage })


router.route("/")
.get(wrapasync(listingController.indexRoute))
.post(isloggedin,upload.single('image'),wrapasync(listingController.insertRoute));

router.get("/new",isloggedin,listingController.renderAddpage);

router.route("/:id")
.get(wrapasync(listingController.showRoute))
.patch(isloggedin,upload.single('image'), wrapasync(listingController.updateRoute))
.delete(isloggedin,isowner,wrapasync(listingController.deleteRoute));

router.get("/:id/edit",isloggedin,isowner,wrapasync(listingController.editRoute));



module.exports = router;