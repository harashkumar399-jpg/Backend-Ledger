const mongoose = require("mongoose");



const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting"],
        unique: [true, "Token already blacklisted"]
    }
}, {
    timestamps: true
});

tokenBlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 }); // Token will be removed from blacklist after 24 hours

const tokenBlacklistModel = mongoose.model("tokenBlacklist", tokenBlacklistSchema);

module.exports = tokenBlacklistModel;