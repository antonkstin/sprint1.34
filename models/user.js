const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlemgth: 2,
    maxlength: 30,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    match: /^https?:\/\/.{2,}\.(gif|jpg|png|svg)$/
  }
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
