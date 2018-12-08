const mongoose = require('mongoose');
// define the schema for our form model
const questionSchema = mongoose.Schema({
    survey: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, required: true },
    userID: String
})



module.exports = mongoose.model('Question', questionSchema)


