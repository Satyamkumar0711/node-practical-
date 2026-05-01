const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId: String,
    longUrl: String,
    accessCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Url", urlSchema);