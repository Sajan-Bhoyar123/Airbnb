if(process.env.NODE_ENV != "production"){
     require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/list.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const Localstratergy = require("passport-local");
const user = require("./models/user.js");
const Booking = require("./models/booking.js");

const DBURL = process.env.ATLASDB_URL;
console.log("Connecting to MongoDB Atlas:", DBURL);

const MongoUrl = "mongodb://127.0.0.1:27017/wonderlust";

const store = MongoStore.create({
  mongoUrl:DBURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE ",err)
})
const expresssession = {
     store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
         expires:Date.now()+7*24*60*60*1000,
         maxAge:7*24*60*60*1000,
         httpOnly:true,
    }
}
const ejsmate = require("ejs-mate");
const app = express();
const methodoverride = require("method-override");
let port = 8080;

const wrapasync = require("./util/wrapasync.js");
const ExpressError = require("./util/express.js");
const {listingschema} = require("./schema.js");
const review = require("./models/review.js");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.engine("ejs",ejsmate);

app.listen(port,()=>{
    console.log(`port is listining of ${port}`);
 })
async function main() {
   try {
    await mongoose.connect(DBURL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log("Connected successfully to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
  /*   mongoose.connect(MongoUrl)*/
}

main()
.then((res)=>{
 console.log("connect successfully");
})
.catch((err)=>{
    console.log(err);
})

app.use(session(expresssession));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error")
     res.locals.curruser = req.user;
     next();
})


app.get("/",(req,res)=>{
   req.flash("error","this page Not Found");   
   res.redirect("./listing")
})
app.get("/listing/search",async(req,res)=>{
    let {Title} = req.query;
    const datas = await Listing.find({title:Title});
    if(datas.length<1){
      req.flash("error","Property NOT Found");
      res.redirect("/listing")
    }else{
           res.render("listing/index.ejs",{datas})
    }
  
})
 // require listing route
const listingRoute = require("./route/listing.js");
app.use("/listing",listingRoute);
 // require review route
const reviewRoute = require("./route/review.js");
app.use("/listing/:id/review",reviewRoute);
  // require user route
const userRoute=  require("./route/user.js");
app.use("/",userRoute);
  // require Booking Route
const bookingRoute = require("./route/booking.js");
app.use("/bookings",bookingRoute);
  //icon Route
app.get("/listing/icon/:icon",async(req,res)=>{
      let {icon} = req.params;
      console.log(icon)
      const datas =await Listing.find({feature:icon});
    /*  console.log(data);
      res.render("listing/index.ejs",{data});*/
    if(datas.length<1){
      req.flash("error","NOT Any Property Has This Feature");
      res.redirect("/listing")
    }else{
           res.render("listing/index.ejs",{datas})
    }
})

app.get("/privacy",(req,res)=>{
res.render("listing/privacy.ejs")
})
app.get("/terms",(req,res)=>{
res.render("listing/terms.ejs")
})

app.get("/city",wrapasync(async(req,res)=>{
    let {city} = req.query;
    console.log("city = ",city);
    const datas =await Listing.find({location:city});
    if(datas.length<1){
         req.flash("error",`NOT any Property belong to that ${city} City`);
         res.redirect("/listing");
    }else{
         res.render("listing/indexx.ejs",{datas});
    }
    
}));
app.get("/listing/icon/:iconname/city/:cityname",wrapasync(async(req,res)=>{
      let {iconname,cityname} = req.params;
      console.log("iconname = ",iconname)
       console.log("cityname = ",cityname)
      const datas = await Listing.find({$and:[{feature:iconname},{location:cityname}]});
      console.log(datas);
      if(datas.length<1){
         req.flash("error",`NOT any Property in ${cityname} belong to that ${iconname} icon`);
         res.redirect(`/city?city=${cityname}`);
      }else{
         res.render("listing/indexx.ejs",{datas});
      }
      
}))
app.use((err,req,res,next)=>{
  console.log(err);
    let {status = 404,message} = err;
  res.status(status).render("./listing/error.ejs",{message});  
})
app.use((req,res,next)=>{
    res.render("./listing/NOTFOUND.ejs")
    next();
})

/*if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/list.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const Localstratergy = require("passport-local");
const user = require("./models/user.js");

const DBURL = process.env.ATLASDB_URL;
console.log("Connecting to MongoDB Atlas:", DBURL);
const MongoUrl = "mongodb://127.0.0.1:27017/wonderlust";

// Set up Express app and middleware first
const ejsmate = require("ejs-mate");
const app = express();
const methodoverride = require("method-override");
let port = 8080;

const wrapasync = require("./util/wrapasync.js");
const ExpressError = require("./util/express.js");
const {listingschema} = require("./schema.js");
const review = require("./models/review.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);

// Database connection function with fallback
async function connectDB() {
  try {
    // First try MongoDB Atlas with SSL options
    await mongoose.connect(DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      ssl: true,
      tls: true
    });
    console.log("Connected successfully to MongoDB Atlas");
    return DBURL;
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err);
    console.log("Attempting to connect to local MongoDB...");
    
    try {
      // Fallback to local MongoDB
      await mongoose.connect(MongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Connected successfully to local MongoDB");
      return MongoUrl;
    } catch (localErr) {
      console.error("Local MongoDB connection error:", localErr);
      throw new Error("Could not connect to any database");
    }
  }
}

// Connect to database and then set up session
connectDB()
  .then((connectionUrl) => {
    console.log("Database connection successful");
    
    // Set up session with the working database connection
    const store = MongoStore.create({
      mongoUrl: connectionUrl,
      crypto: {
        secret: "mysecretcode",
      },
      touchAfter: 24 * 3600,
    });
    
    store.on("error", (err) => {
      console.log("ERROR in MONGO SESSION STORE", err);
    });
    
    const expresssession = {
      store,
      secret: "mysecretcode",
      resave: false,
      saveUninitialized: true,
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }
    };
    
    // Set up session after database connection is established
    app.use(session(expresssession));
    app.use(flash());
    
    // Set up Passport authentication
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new Localstratergy(user.authenticate()));
    passport.serializeUser(user.serializeUser());
    passport.deserializeUser(user.deserializeUser());
    
    // Flash and user middleware
    app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.curruser = req.user;
      next();
    });
    
    // Routes
    app.get("/", (req, res) => {
      req.flash("error", "this page Not Found");
      res.redirect("./listing");
    });
    
    // Route modules
    const listingRoute = require("./route/listing.js");
    app.use("/listing", listingRoute);
    
    const reviewRoute = require("./route/review.js");
    app.use("/listing/:id/review", reviewRoute);
    
    const userRoute = require("./route/user.js");
    app.use("/", userRoute);
    
    // Error handling routes
    app.use((err, req, res, next) => {
      console.log(err);
      let {status = 404, message} = err;
      res.status(status).render("./listing/error.ejs", {message});
    });
    
    // 404 route - must be the last route
    app.use((req, res) => {
      res.status(404).render("./listing/NOTFOUND.ejs");
      // Don't call next() here as this is the last middleware
    });
    
    // Start the server after everything is set up
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Fatal database connection error:", err);
    process.exit(1);
  });*/
  
  
 /* if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/list.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const Localstratergy = require("passport-local");
const user = require("./models/user.js");

// Get MongoDB Atlas URL from environment variables
const DBURL = process.env.ATLASDB_URL;
console.log("Connecting to MongoDB Atlas:", DBURL);

// Set up Express app and middleware
const ejsmate = require("ejs-mate");
const app = express();
const methodoverride = require("method-override");
let port = 8080;

const wrapasync = require("./util/wrapasync.js");
const ExpressError = require("./util/express.js");
const {listingschema} = require("./schema.js");
const review = require("./models/review.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);

// Database connection function specifically for Atlas
async function connectToAtlas() {
  try {
    await mongoose.connect(DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      // These options help with SSL/TLS connection issues
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      // Set Node.js DNS lookup timeout
      family: 4  // Force IPv4
    });
    console.log("Connected successfully to MongoDB Atlas");
    return true;
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err);
    return false;
  }
}

// Connect to database and set up the application
connectToAtlas()
  .then((connected) => {
    if (!connected) {
      console.log("Failed to connect to MongoDB Atlas. Exiting application.");
      process.exit(1);
    }
    
    console.log("Atlas connection successful");
    
    // Set up session store with Atlas connection
    const store = MongoStore.create({
      mongoUrl: DBURL,
      crypto: {
        secret: "mysecretcode",
      },
      touchAfter: 24 * 3600,
    });
    
    store.on("error", (err) => {
      console.log("ERROR in MONGO SESSION STORE", err);
    });
    
    const expresssession = {
      store,
      secret: "mysecretcode",
      resave: false,
      saveUninitialized: true,
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }
    };
    
    // Set up session middleware
    app.use(session(expresssession));
    app.use(flash());
    
    // Set up Passport authentication
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new Localstratergy(user.authenticate()));
    passport.serializeUser(user.serializeUser());
    passport.deserializeUser(user.deserializeUser());
    
    // Set up locals middleware for templates
    app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.curruser = req.user;
      next();
    });
    
    // Routes
    app.get("/", (req, res) => {
      req.flash("error", "this page Not Found");
      res.redirect("./listing");
    });
    
    // Route modules
    const listingRoute = require("./route/listing.js");
    app.use("/listing", listingRoute);
    
    const reviewRoute = require("./route/review.js");
    app.use("/listing/:id/review", reviewRoute);
    
    const userRoute = require("./route/user.js");
    app.use("/", userRoute);
    
    // Error handling routes
    app.use((err, req, res, next) => {
      console.log(err);
      let {status = 404, message} = err;
      res.status(status).render("./listing/error.ejs", {message});
    });
    
    // 404 route - must be the last route
    app.use((req, res) => {
      res.status(404).render("./listing/NOTFOUND.ejs");
    });
    
    // Start the server after everything is set up
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Fatal error:", err);
    process.exit(1);
  });*/