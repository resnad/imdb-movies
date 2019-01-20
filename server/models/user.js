const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  email: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean
  },
  date: Date
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .required()
      .min(1)
      .max(255),
    email: Joi.string()
      .email()
      .min(1)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.validate = validateUser;
exports.User = User;
