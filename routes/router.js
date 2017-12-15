// Load all the required modules
var express = require('express');
var UserProfile = require('../models/profileModel');

var router = express.Router();

// displaying create profile page
router.get('/profile/create', function (request, response) {
    response.render('profile');
 });

// display all the created profiles of a user
router.route("/profile")
    .get(function (request, response) {
        var sessionData = request.session;
        var usr_id = sessionData.user_id;

        UserProfile.find({'user': usr_id}, function (err, results) {
        if (err) {
            throw err;
        } else {
            response.render('list', {'profiles': results});
        }
        });
    })
    // post endpoint for creating user profile
    .post(function(request, response) {
        var body = request.body;
        var sessionData = request.session;
        var usr_id = sessionData.user_id;

        // creating new user profile object
        var newProfile = new UserProfile();
        newProfile.user = usr_id;
        newProfile.email = body.email;
        newProfile.phone = body.phone;
        newProfile.dob = body.dob;
        newProfile.address = body.address;

        newProfile.save(function (err, result) {
            if (err) {
                response.send(err);
            } else {
                response.redirect('/api/profile/' + result._id+ '/');
            }
        });
    });

// Read endpoint to read all the profiles of a user
router.route('/profile/:id')
    .get(function (request, response) {
        var id = request.params.id;
        var sessionData = request.session;
        var usr_id = sessionData.user_id;

        UserProfile.findOne({'_id': id}, function (err, data) {
            if (err) {
                response.send("This profile doesn't exist");
            } else {
                // Authorizing user using session data(matching the user id to the session data id)
                if (data.user === usr_id) {
                    response.render('detail', {'data': data, 'user_id': usr_id});
                } else {
                    response.json("You are not authorized to read other's profile");
                }
            }
        });
    })
    // Put endpoint to update the profile
    .put(function (request, response) {
        var id = request.params.id;
        var sessionData = request.session;
        var usr_id = sessionData.user_id;

        UserProfile.findOne({_id:id}, function(err, user_profile){
            if (err) {
                response.send("This profile doesn't exist");
            } else {
                if (user_profile.user === usr_id) {
                    for(prop in request.body){
                        // Do not modify the user object, only profile object will be updated
                        if (prop != 'user') {
                            user_profile[prop]=request.body[prop];
                        }
                    }
                    // save
                    user_profile.save(function(err) {
                        if (err) {
                            response.send(err);
                        } else {
                            response.json(user_profile);
                        }
                    });
                } else {
                    response.send("You can not modify other's profile");
                }
            }
        });
    })
    // Delete endpoint to delete profile of a user
    .delete(function (request, response) {
        var id = request.params.id;
        var sessionData = request.session;
        var usr_id = sessionData.user_id;

        UserProfile.findOne({_id:id}, function(err, user_profile){
            if (err) {
                response.send("This profile doesn't exist");
            } else {
                if (user_profile.user === usr_id) {
                    user_profile.remove(function (err) {
                        if (err) throw err;
                        response.sendStatus("204");
                    })
                } else {
                    response.send("You can not delete other's profile");
                }
            }
        });
    });

module.exports = router;