
const express = require('express');
const config = require('dotenv').config({path: './.env'})
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const cors = require('cors');
const nocache = require("nocache");
const cookieParser = require('cookie-parser');


const app = express();

app.set('view engine', 'ejs');
app.set('views', ['./views/admin', './views/user' ]);


app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(nocache());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());
// app.use(express.bodyPaser());
app.use(bodyParser.urlencoded({ extended: false }))





app.use('/', require('./routes/userRoute.js') );
app.use('/admin', require('./routes/adminRoute.js'));


// 404 Not Found handler
app.get('*', (req, res, next) => {
    res.status(404).render('404.ejs')
});

  // 500 Internal Server Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('500.ejs', { userIn: req.session.userIn });
// });
  


module.exports = app;