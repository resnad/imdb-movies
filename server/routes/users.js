const auth = require("../middleware/auth");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validate } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // Validate request
  const { error } = await validate(req.body);
  if (error) return res.status(400).send(error.details[0].mesagge);

  // Check if user is already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User is already registered");

  // We pick what we want from the user request to avoid malicious requests
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // Passowrd Hashing
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
