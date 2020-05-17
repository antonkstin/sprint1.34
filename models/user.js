const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const WestCoastCustomError = require('../middlewares/error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      }
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
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

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new WestCoastCustomError("Неправильные почта или пароль", 401);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new WestCoastCustomError("Неправильные почта или пароль", 401);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
