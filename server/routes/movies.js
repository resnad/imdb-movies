const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = new Movie({
    title: req.body.title,
    duration: req.body.duration
  });

  await movie.save();
  res.send(movie);
});

module.exports = router;
