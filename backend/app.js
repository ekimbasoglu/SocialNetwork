const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
//Import Routes
const userRoute = require('./routes/user');

app.use(cors());
mongoose.set('useCreateIndex', true);

// bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRoute);

//routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Connect to Db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to Db!');
});

//listen
app.listen(3000);
