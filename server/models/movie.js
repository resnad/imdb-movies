const mongoose = require("mongoose");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 80
  },
  duration: {
    type: String,
    required: true
  },
  summary: {
    type: String
    // required: true
  },
  releaseDate: {
    type: String
    // required: true
  },
  genre: {
    type: String
    // required: true
  },
  MPAA: String,
  director: String,
  posterUrl: {
    type: String
    // required: true
  }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(1)
      .max(50)
      .required(),
    duration: Joi.number()
      .max(300)
      .required(),
    summary: Joi.string()
      .required()
      .min(20)
      .max(255),
    genre: Joi.string()
      .required()
      .min(1)
      .max(30)
  };

  return Joi.validate(movie, schema);
}

exports.validate = validateMovie;
exports.Movie = Movie;
