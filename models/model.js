var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new Schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String
});

var userProfile = new Schema({
    email: String,
    phone: String,
    dob: Date,
    address: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
