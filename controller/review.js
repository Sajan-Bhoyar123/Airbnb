const Listing = require("../models/list.js");
const review = require("../models/review.js");

const constructorReview =  async(req,res)=>{
     let {id} = req.params;
     const list = await Listing.findById(id);
     let {comment,rating} = req.body;
     const newreview = new review({comment:comment,rating:rating});
     newreview.author = req.user._id;
     list.reviews.push(newreview);
     await newreview.save();
     await list.save();
     req.flash("success","successfully added your review");
     res.redirect(`http://localhost:8080/listing/${id}`)
}

const destructorReview = async(req,res)=>{
       let {id,reviewid} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
        await review.findByIdAndDelete(reviewid);
          req.flash("success","successfully delete your review");
        res.redirect(`http://localhost:8080/listing/${id}`)
  }

const RedirectRoute = (req,res)=>{
     let {id,reviewid} = req.params;
    req.flash("success","successfully login ");
     res.redirect(`http://localhost:8080/listing/${id}`)

}
module.exports = {constructorReview,destructorReview,RedirectRoute};