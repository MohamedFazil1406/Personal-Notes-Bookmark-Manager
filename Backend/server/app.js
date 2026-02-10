require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api/auth", require("../routes/auth/Sessionlogin"));
app.use("/api/auth", require("../routes/auth/Sessionlogout"));
app.use("/api/notes", require("../routes/note.routes"));
app.use("/api/bookmarks", require("../routes/bookmark.routes"));

app.get("/", (req, res) => {
  res.send("Hello from App 🚀");
});

module.exports = app;
