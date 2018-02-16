var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');


var roomSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "photos": [String],
    "price": Number,
    "ratingValue": Number,
    "reviews": Number,
    "city": String,
    "loc": {
        "type": [Number], // Longitude et latitude
        "index": "2d" // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
    },
    "user": {
        "type": mongoose.Schema.Types.ObjectId,
        "ref": "User"
    }

})

var Room = mongoose.model("Room", roomSchema);

module.exports = Room