// load the things we need
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt-nodejs');

// define the schema for our form model
const paperSchema = mongoose.Schema({
    title: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, required: true }
})



module.exports = mongoose.model('Paper', paperSchema)