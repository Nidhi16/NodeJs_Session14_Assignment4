var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var User = require('./model');

// Made user profile model
var userProfile = new Schema({
    user: String,
    email: String,
    phone: String,
    dob: Date,
    address: String
});

var UserProfile = mongoose.model('UserProfile', userProfile);

module.exports = UserProfile;
