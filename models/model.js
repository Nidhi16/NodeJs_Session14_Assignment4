var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new Schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
