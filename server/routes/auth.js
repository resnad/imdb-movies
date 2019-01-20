const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("joi");

router.post("/", async (req, res) => {
  // Validate request
  const { error } = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].mesagge);

  // Check if user is already registered
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(req) {
  const schema = {
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

  return Joi.validate(req, schema);
}

module.exports = router;
