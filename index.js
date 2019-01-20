require("express-async-errors");
const config = require("config");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const movies = require("./server/routes/movies");
const auth = require("./server/routes/auth");
const helmet = require("helmet");
const users = require("./server/routes/users");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// DB
mongoose.connect(
  "mongodb://some-url",
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Successfully connected to the database"));

// Middleware

app.use(cors());
app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server listening");
});
