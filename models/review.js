const mongoose = require("mongoose");
const user = require("./user.js");
const reviewschema = new mongoose.Schema({
    comment: {
        type: String, // ✅ Capital S
    },
    rating: {
        type: Number, // ✅ Capital N
        min: 1,
        max: 5
    },
    createdat: {
        type: Date,
        default: Date.now // ✅ Use function reference, not call
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }

});

const review = mongoose.model("review", reviewschema);
module.exports = review;
