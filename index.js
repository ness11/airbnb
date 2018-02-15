var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var uid2 = require("uid2");
var encBase64 = require("crypto-js/enc-base64");
var uniqueValidator = require('mongoose-unique-validator');

var Room = require("./models/room");
var User = require("./models/user");
var apiRoomRoutes = require("./routes/api-room");
var apiUserRoutes = require("./routes/api-user");


mongoose.connect("mongodb://localhost:27017/airbnb-api");

// parse application/json
app.use(bodyParser.json())

app.use("/api", apiUserRoutes);
app.use("/api", apiRoomRoutes);


app.listen(3000, function() {
    console.log("Server has started");
});