// server.js

// set up ======================================================================
// get all the tools I need
const express = require('express')
const app = express()
const port = process.env.PORT || 7000
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const configDB = require('./config/database.js')
let ejs = require('ejs')
let db

// configuration ===============================================================
mongoose.connect(configDB.url, { useMongoClient: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db)
}) // connect to database



require('./config/passport')(passport) // pass passport for configuration

// set up express application
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public/views'))

// Ejs Middleware
app.set('view engine', 'ejs') // set up ejs for templating
app.use(express.static('public/views'))
app.use(expressLayouts)


// required for passport
app.use(session({
  secret: 'moo', // session secret
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load my routes and pass in the app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log(`Application started on ${port}`)
