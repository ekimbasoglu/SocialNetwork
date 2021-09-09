const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expressJwt = require("express-jwt");
const lusca = require("lusca");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const environments = require("./config/environments");
const { name } = require("./package.json");
const path = require("path");
const ErrorHandler = require("./middlewares/errorHandling/errorHandler");
const mongoDB = require("./config/database/connection");
require('dotenv/config');


const port = environments.PORT;
const appURL = `http://localhost:${port}/`;
mongoose.Promise = global.Promise;

const app = express();


//App Routes
// const userRoutes = require('./routes/user');
// Newer version down below, use later components
const UserRoutes = require('./components/user/usersRouter');


app.use(cors());
app.use(express.json({ limit: "20mb" }));
mongoose.set('useCreateIndex', true);
app.use(compression());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

// Security
app.use(lusca.xframe("ALLOWALL"));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));


// Create the database connection
mongoose.connect(mongoDB.connectionString(), {
  // this one isn't compatible with useUnifideToplogy
  // reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  useCreateIndex: true,
  // so it will remove deprication warrning
  useFindAndModify: false,
  // so it will remove warrning
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  // eslint-disable-next-line no-console
  console.log(
    `Mongoose default connection open to ${mongoDB.connectionString()}`
  );
});

// CONNECTION EVENTS
// If the connection throws an error
mongoose.connection.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  // eslint-disable-next-line no-console
  console.log("Mongoose default connection disconnected");
});

// When the connection is open
mongoose.connection.on("open", () => {
  // eslint-disable-next-line no-console
  console.log("Mongoose default connection is open");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    // eslint-disable-next-line no-console
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

//Routes
app.use('/user', UserRoutes);

app.use(ErrorHandler());

//default route
app.get('/', (req, res) => {
  res.send('Home Page');
});

console.log(`__________ ${name} __________`);
// eslint-disable-next-line no-console
console.log(`Starting on port: ${port}`);
// eslint-disable-next-line no-console
console.log(`Env: ${environments.NODE_ENV}`);
// eslint-disable-next-line no-console
console.log(`App url: ${appURL}`);
// eslint-disable-next-line no-console
console.log("______________________________");

app.listen(port);
module.exports = app;
