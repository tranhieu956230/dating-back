const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    fb_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);
