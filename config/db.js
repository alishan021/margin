
const mongoose = require('mongoose');

const mongoDB = process.env.DB_URI;
// const mongoDB = 'mongodb://localhost:27017/margin-tools';

const db_connect = mongoose.connect(mongoDB)
                .then(() => console.log('database connected succesfully'))
                .catch((error) => console.log('Database error : ' + error));

module.exports = db_connect;