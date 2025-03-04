const mongoose = require("mongoose");
const cron = require('node-cron');
// Define the user schema
const userSchema = new mongoose.Schema({
    orgName: { type: String, required: true },
    adminname: { type: String, required: true },
    category:{type:String,default:"Error"},//AD1
    safetystring: { type: String, required: true },
    isFingerprintauthenticated: { type: String, required: true },
    socketiocode:{type:String,default:"Not Scanned the Signed IN!"},
    onetimeloginstring:{type:String,default:"Error"},
    currentsession: { type: Boolean, default: false },
    sessionExpiresAt: { type: Date },  // No default here
});

// Remove TTL index (if you had added it earlier)


// Create the User model
const User = mongoose.model("User", userSchema);


// Export the User model
module.exports = User;
    