var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');


var userSchema = new mongoose.Schema({
    account: {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true
        },
        biography: String
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    token: String,
    hash: String,
    salt: String,
    rooms: [{
        "type": mongoose.Schema.Types.ObjectId,
        "ref": "Room"
      }]
})
userSchema.plugin(uniqueValidator, { message: "{PATH} is already taken" });
  
var User = mongoose.model("User", userSchema);

module.exports = User

