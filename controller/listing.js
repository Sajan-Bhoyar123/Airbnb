const { models } = require("mongoose");
const Listing = require("../models/list.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const indexRoute = async(req,res)=>{
      const data = await Listing.find({});
      res.render("./listing/index.ejs",{data});
}
const renderAddpage = (req,res)=>{
    res.render("./listing/add.ejs")
}
const showRoute = async(req,res)=>{
      let {id} = req.params;
      const data = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); 
     
      if(!data){
            req.flash("error","your requested property is Not exist");
            res.redirect("/listing")
      }else{
            res.render("./listing/show.ejs",{data});
     }     
} 
const insertRoute = async(req,res)=>{
       let {title ,description,image,price,location,country} = req.body;
        let response =   await geocodingClient.forwardGeocode({
               query: location ,
               limit: 1,
            })
            .send()
           ;
         
          const url = req.file.path;
         const filename = req.file.filename;
         
           const newlist = new Listing({title:title,description:description,price:price,location:location,country:country});
           newlist.image = {url,filename};
           newlist.owner = req.user._id;
            newlist.geometry = response.body.features[0].geometry;
        let savelist =  await newlist.save();
         req.flash("success","successfully added new property");
      console.log(savelist);
        res.redirect("/listing");
}
const editRoute = async(req,res,next)=>{
           let {id} = req.params;
           const data = await  Listing.findById(id);
           console.log(data);
           if(!data){
              req.flash("error","your requested property is Not exist");
              res.redirect("/listing")
           }else{
                let originalImageurl=data.image.url;
                console.log(originalImageurl);
                 originalImageurl =   originalImageurl.replace("/upload","/upload/w_250");
                 console.log(originalImageurl);
                 res.render("./listing/edit.ejs",{data,originalImageurl});
           }
 }
const updateRoute=async (req, res, next) => {
         if(!req.body){
             throw new ExpressError(400,"enter correct data");
           }
         const { id } = req.params;
         const { title, description, image, price, location, country } = req.body;
          let response =   await geocodingClient.forwardGeocode({
               query: location ,
               limit: 1,
            })
            .send()
           ;
         const updatedData = await Listing.findByIdAndUpdate(
           id,
           { title, description, image, price, location, country },
           { new: true, runValidators: true }
          );
        if(typeof req.file !== "undefined" ){
              const url = req.file.path;
               const filename = req.file.filename;
              updatedData.image = {url,filename};
              await updatedData.save();
        }
        console.log(updatedData);
      updatedData.geometry = response.body.features[0].geometry;
      await updatedData.save();
       req.flash("success","successfully Edit a property");
       console.log(updatedData);
       res.redirect(`/listing/${id}`);
}
const deleteRoute = async(req,res)=>{
          let {id} = req.params;
           const deletedata = await Listing.findByIdAndDelete(id);
          req.flash("success","successfully Deleted a property");
          res.redirect("/listing");
}
module.exports = {indexRoute,renderAddpage,showRoute,insertRoute,editRoute,updateRoute,deleteRoute};
