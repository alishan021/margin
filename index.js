
const express = require('express');
const config = require('dotenv').config({path: './.env'})
const bodyPaser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', ['./views/admin', './views/user' ]);


app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));




app.use('/', require('./routes/userRoute.js') );
// app.use('/admin', require('./routes/adminRoute.js'); );


module.exports = app;