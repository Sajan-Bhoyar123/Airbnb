const user = require("../models/user.js");

const renderSignup = (req,res)=>{
       res.render("./user/signup.ejs");
}
const signup = async(req,res)=>{
     try{
         let {username,email,password,image} = req.body;
          let url = req.file.path;          
          let filename = req.file.filename;
          let user1 = new user({username:username,email:email});
         user1.image = {url,filename};
       const registeruser = await user.register(user1,password);
       req.logIn(registeruser,(err)=>{
          if(err){
           return next(err);
          }else{
            req.flash("success","successfully Login")
             res.redirect("/listing");
            console.log(registeruser);
        }
       })
         

      }catch(err){
       req.flash("error",err.message);
        res.redirect("/signup");
  }
}
const renderLogin = (req,res)=>{
    res.render("./user/login.ejs")
}
const Login = async(req,res)=>{
    req.flash("success","Welcome to WonderLust");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}
const Loggout =  (req,res,next)=>{
   req.logOut((err)=>{
          if(err){
            return next(err);
          }else{
            req.flash("success","successfully Logout");
            res.redirect("/listing");
          }
     })
  }
module.exports = {renderSignup,signup,renderLogin,Login,Loggout};