// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
const userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },

});

// generating a hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = (password, dbPassword) => {
    console.log('pass and local: ', password, dbPassword)
    return bcrypt.compareSync(password, dbPassword)
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema)

