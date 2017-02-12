var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = Schema({
  name: String,
  email: String,
  dob: Date,
  currentCity: String,
  profilePicture: String,
  passwordDigest: String,
  visitedPlaces: [{
    type: Schema.Types.ObjectId,
    ref: 'UserPlace'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
