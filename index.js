var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var uid2 = require("uid2");
var encBase64 = require("crypto-js/enc-base64");
var uniqueValidator = require('mongoose-unique-validator');


mongoose.connect("mongodb://localhost:27017/airbnb-api");

// parse application/json
app.use(bodyParser.json())

var mailgun = require("mailgun-js");
var api_key = 'key-bfe679245710dac7e4d870690a43ef61';
var DOMAIN = 'sandboxdfc2f679cf3242ec91061cc820be204e.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});




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
    salt: String
})
userSchema.plugin(uniqueValidator, { message: "{PATH} is already taken" });
  
var User = mongoose.model("User", userSchema);


app.post("/api/user/sign_up/", function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var biography = req.body.biography;
    var token = uid2(32);
    var salt = uid2(32);
    user = new User({
        account: {
            username: username,
            biography: biography
        },
        email: email,
        token: token,
        hash: SHA256(password + salt).toString(encBase64),
        salt: salt
    })
    user.save(function(err, obj) {
        if (err) {
            res.send(err)
          console.log("something went wrong");
        } else { 
            res.json({
                account: {
                _id: user._id,
                token: token,
                account: {
                    username: username,
                    biography: biography
                    }
                }
            });
          console.log("we just saved the new student " + obj.account.username);
        }
      });
      var data = {
        from: 'Airbnb <me@samples.mailgun.org>',
        to: user.email,
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
      };
      
      mailgun.messages().send(data, function (error, body) {
        console.log(body);
      });
    // RES.JSON APRES SAUVEGARDE DANS CALLBACK
   
});

app.post("/api/user/log_in", function(req, res) {
    var email = req.body.email;
    var username = req.body.username
    var password = req.body.password
    if (email){
        User.findOne({ email: email }).exec(function(err, user) {
            password = SHA256( password + user.salt).toString(encBase64);
            if (!err) {
                if (password === user.hash){
                    res.json({
                        "_id": user._id,
                        "token": user.token,
                        "account": {
                        "username": user.account.username,
                        "biography": user.account.biography
                        }
                    })
                } else {
                    res.json("WRONG")
                }
            // GERER ERREUR
            } else {
                return res.status(400).json({
                    "error": {
                        "code": 9470988,
                        "message": "Something wrong"
                    }
                })  
            }
            
        });
    } else if (username)  {
        User.findOne({ "account.username" : username }).exec(function(err, user) {
            password = SHA256( password + user.salt).toString(encBase64);
            if (!err) {
                if (password === user.hash){
                    res.json({
                        "_id": user._id,
                        "token": user.token,
                        "account": {
                        "username": user.account.username,
                        "biography": user.account.biography
                        }
                    })
                } else {
                    res.json("WRONG")
                }
            // GERER ERREUR
            } else {
                return res.status(400).json({
                    "error": {
                        "code": 9470988,
                        "message": "Something wrong"
                    }
                })  
            }
        })
    }

});

// app.post("/api/user/log_in", function(req, res) {
//     var email = req.body.email;
//     var password = req.body.password
//     User.findOne({ email: email }).exec(function(err, user) {
//         password = SHA256( password + user.salt).toString(encBase64);
//         if (!err) {
//             if (password === user.hash){
//                 res.json({
//                     "_id": user._id,
//                     "token": user.token,
//                     "account": {
//                     "username": user.account.username,
//                     "biography": user.account.biography
//                     }
//                 })
//             } else {
//                 res.json("WRONG")
//             }
//         // GERER ERREUR
//         } else {
//             return res.status(400).json({
//                 "error": {
//                     "code": 9470988,
//                     "message": "Something wrong"
//                 }
//             })  
//         }
        
//     });
    
// });

app.get("/api/user/:id", function(req, res) {
    var id = req.params.id
    var token = req.headers.authorization

    // VERIFIER TOKEN AVANT DE FAIRE LA REQUETE
    if (!token){
        return res.status(400).json({
            "error": {
                "code": 9473248,
                "message": "Invalid token"
            }
        })
    } else {
        token = token.split(" ")
        var deleteBearer = token.shift()
        token = token.join()
        User.findOne({token: token}, function(err, user) {
            if (user) {
                // le token est valide car un user a été trouvé
                User.findOne({ _id : id }).exec(function(err, user) {
                    res.json({
                        "_id": user.id,
                        "account": {
                            "username": user.account.username,
                            "biography": user.account.biography
                        }
                    });
                })
            } else {
                return res.status(400).json({
                    "error": {
                    "code": 48326,
                    "message": "Invalid token"
                    }
                })
            }
        });
    }  
});

app.listen(3000, function() {
    console.log("Server has started");
});