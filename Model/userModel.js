const mongoose = require("mongoose");
const cron = require('node-cron');
// Define the user schema
const userSchema = new mongoose.Schema({
    orgName: { type: String, required: true },
    adminname: { type: String, required: true },
    category:{type:String,default:"Error"},//AD1
    safetystring: { type: String, default:"randomized" },
    isFingerprintauthenticated: { type: String, default:false },
    socketiocode:{type:String,default:"Not Scanned the Signed IN!"},
    onetimeloginstring:{type:String,default:"Error"},
    currentsession: { type: Boolean, default: false },
    sessionExpiresAt: { type: Date },  // No default here
    nameofemployee:{type:String},
    phonenumber:{type:String},
    personalemailid:{type:String},
    gender:{type:String},
    date:{type:String},
    designation:{type:String},
    department:{type:String},
});

// Remove TTL index (if you had added it earlier)


// Create the User model
const User = mongoose.model("User", userSchema);


// Export the User model
module.exports = User;
    