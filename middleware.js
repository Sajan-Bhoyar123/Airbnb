const Listing = require("./models/list.js");
const review = require("./models/review.js");
const isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
         req.session.redirectUrl = (req.originalUrl);
        req.flash("error","You Must Login First");
        return res.redirect("/login");
    }
    next();
}

const saveurl = (req,res,next)=>{
  if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
const isowner =async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if( !listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","you are Not a owner of that property");
        res.redirect(`/listing/${id}`);
    }else{
      next();
    }
}
const isauthor =async (req,res,next)=>{
    let {id,reviewid} = req.params;
    const reviews = await review.findById(reviewid);
    if(!reviews.author.equals(res.locals.curruser._id)){
        req.flash("error","you are Not a Author of that review");
        res.redirect(`/listing/${id}`);
    }else{
      next();
    }
}
module.exports = {
  saveurl,
  isloggedin,
  isowner,
  isauthor,
};