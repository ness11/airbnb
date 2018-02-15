var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var uid2 = require("uid2");
var encBase64 = require("crypto-js/enc-base64");
var User = require("../models/user");
var Room = require("../models/room");

router.post("/room/publish", function(req, res) {
	var title = req.body.title;
	var desciption = req.body.description;
	var photos = req.body.photos;
	var price = req.body.price;
	var city = req.body.city
	var loc = req.body.loc
	var ratingValue = req.body.ratingValue;
	var reviews = req.body.reviews;
	var token = req.headers.authorization
	token = token.split(" ")
	var deleteBearer = token.shift()
	token = token.join()
	
	if (!token){
		return res.status(400).json({
			"error": {
				"code": 9473248,
				"message": "Invalid token"
			}
		})
	} else {
		User.findOne({token: token}, function(err, user) {
			if (user){
				var room = new Room({
					"title": title,
					"description": desciption,
					"photos": photos,
					"price": price,
					"city": city,
					"loc": loc,
					"ratingValue": ratingValue,
					"reviews": reviews,
					"user": {
						"_id": user.id,
						"account": {
							"username": user.account.username
						}
					}
				})
				room.save(function(err, obj) {
					if (err) {
						res.send(err)
					console.log("something went wrong");
					} else { 
						res.json({
							"_id": room.id,
							"title": title,
							"description": desciption,
							"photos": photos,
							"price": price,
							"city": city,
							"loc": loc,
							"ratingValue": ratingValue,
							"reviews": reviews,
							"user": {
								"_id": user.id,
								"account": {
									"username": user.account.username
								}
							}
						})
					console.log("we just saved the new student " + obj.title);
					}
				});    
			} else {
				res.status(400).json({
					"error": {
						"code": 48326,
						"message": "Invalid token"
					}
				})
			} 
		})
	}
})

router.get("/room/:id", function(req, res) {
  var id = req.params.id
console.log(id)
  // VERIFIER TOKEN AVANT DE FAIRE LA REQUETE
  if (!id){
      return res.status(400).json({
          "error": {
              "code": 9473248,
              "message": "Invalid token"
          }
      })
  } else {
      Room.findOne({_id: id}).populate({ path: 'user', select: 'account.username' }).exec(function(err, room) {
          if (id && !err) {
            res.json({
              "_id": room.id,
              "title": room.title,
              "description": room.description,
              "photos": room.photos,
              "price": room.price,
              "city": room.city,
              "loc": room.loc,
              "ratingValue": room.ratingValue,
              "reviews": room.review,
              "user": room.user
              
            });
              
          } else {
              return res.status(400).json({
                  "error": {
                  "code": 49000,
                  "message": "Invalid id"
                  }
              })
          }
      });
  }  
});

router.get("/room/", function(req, res) {
  var criteria = req.query;
  console.log(criteria)
  Room.find(criteria).exec(function(err, rooms) {
    Room.count(criteria).exec(function(err, count) {
      res.json({
        "rooms": rooms,
        "count" : count
      })
    })
  })
});

module.exports = router;