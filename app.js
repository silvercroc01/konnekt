const express = require('express');
const bcrypt = require('bcrypt')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const port = 3000;
const connectToDB = require('./src/config/database');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestsRouter = require("./src/routes/requests");
const userRouter = require("./src/routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

// Root route
app.get('/', (req, res) => {
  res.send("hello suckers");
});

// Start server

connectToDB()
  .then(() => {
    console.log(" Connection to Datebase Successful")
    app.listen(port, () => {
      console.log(` Hello Sucker Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Connection to Datebase Failed");
  });
