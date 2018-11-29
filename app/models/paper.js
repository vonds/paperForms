// load the things we need
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
const paperSchema = mongoose.Schema([{

    question: String,
    answer: String
}])

module.exports = mongoose.model('Paper', paperSchema)