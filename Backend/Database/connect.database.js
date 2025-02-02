const mongoose = require('mongoose');

function connectDatabase() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected Database');
    }).catch((err) => {
        console.log('Error connecting to Database');
        console.log(err);
    });
}

module.exports = connectDatabase;