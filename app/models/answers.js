const mongoose = require('mongoose');
// define the schema for our form model
const answerSchema = mongoose.Schema({
    userID: String, // link from user collection
    surveyID: String, // link from question collection
    answer: { type: String, required: true }
})



module.exports = mongoose.model('Answer', answerSchema)

