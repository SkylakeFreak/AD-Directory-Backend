const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    orgName: { type: String, required: true },
    adminname: { type: String, required: true, unique: true },
    safetystring: { type: String, required: true },
    isFingerprintauthenticated: { type: String, required: true },
    currentsession:{type:Boolean,default:false}
});

const User = mongoose.model("User", userSchema);
module.exports = User;
