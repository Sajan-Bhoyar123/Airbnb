
const mongoose = require("mongoose");
const listing = require("../models/list.js");
const initdata = require("./data.js");
async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}
main()
.then((res)=>{
 console.log("connect successfully");
})
.catch((err)=>{
    console.log(err);
})

const initDB = async()=>{
      await listing.deleteMany({});
     initdata.data =  initdata.data.map((obj)=>({...obj,owner:"6820ab84f57ea60f44a44de2"}))
      await listing.insertMany(initdata.data);
      console.log("data was initilized");
}
initDB();
let list1 = new listing({title:"sajan",description:"hemant",price:97953479,location:"mubai",country:"india"});
list1.save()
.then((res)=>{
   console.log(res);
})
.catch((err)=>{
  console.log(err);
})
