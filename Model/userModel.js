const mongoose = require("mongoose");
const cron = require('node-cron');

// Define the user schema
const userSchema = new mongoose.Schema({
    orgName: { type: String, required: true },
    adminname: { type: String, required: true },
    safetystring: { type: String, required: true },
    isFingerprintauthenticated: { type: String, required: true },
    currentsession: { type: Boolean, default: false },
    sessionExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 1000), // 1-minute expiration
    },
});

// Remove TTL index (if you had added it earlier)


// Create the User model
const User = mongoose.model("User", userSchema);

// Schedule the cron job to run every minute
cron.schedule('* * * * *', async () => {
    const currentTime = new Date();

    // Find users whose session has expired and update their 'currentsession' to false
    await User.updateMany(
        { sessionExpiresAt: { $lte: currentTime }, currentsession: true },
        { $set: { currentsession: false } }
    );

    console.log('Checked and updated expired sessions.');
});

// Export the User model
module.exports = User;
