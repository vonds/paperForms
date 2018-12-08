
const ObjectID = require('mongodb').ObjectID
const Question = require('./models/questions')
const Answer = require('./models/answers')
module.exports = (app, passport, db) => {


    // normal routes ===============================================================

    // Index Route
    app.get('/', (req, res) => {
        const locals = {
            title: 'Paper'
        }
        res.render('index', locals)
    })

    // About Route
    app.get('/about', (req, res) => {
        res.render('about')
    })

    // Thanks Route
    app.get('/thanks', (req, res) => {
        res.render('thanks')
    })

    // Forms
    app.get('/forms', isLoggedIn, (req, res) => {

        console.log(req.query)
        Question.find({ survey: req.query.survey }, (err, result) => {
            console.log('this is the result:', result)
            const locals = {

                question: result,
                isEditing: !(req.query.isTaking && req.query.isTaking === 'yes'),
            }
            res.render('forms', locals)

        })

    })

    // Edit Form
    app.get('/edit', isLoggedIn, (req, res) => {
        console.log('survey =', req.query.survey)
        res.render('edit', {
            survey: req.query.survey ? req.query.survey : ''
        })
    })

    // Add Paper Form
    app.get('/add', isLoggedIn, (req, res) => {
        console.log('survey =', req.query.survey)
        res.render('add', {
            survey: req.query.survey ? req.query.survey : ''
        })
    })

    app.get('/list', isLoggedIn, (req, res) => {
        Question.find({ userID: req.user._id }, (err, result) => {
            const surveyList = []
            for (let i = 0; i < result.length; i++) {
                if (!surveyList.includes(result[i].survey)) {
                    surveyList.push(result[i].survey)
                }
            }
            res.render('list', {
                surveyList: surveyList
            })
        })
    })


    // LOGOUT ==============================
    app.get('/logout', isLoggedIn, (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Form routes ===============================================================


    app.post('/forms', isLoggedIn, (req, res) => {
        console.log(req.body)
        const survey = req.body.survey
        const question = req.body.question
        const type = req.body.type
        const userID = req.user._id
        const locals = { isEditing: true }
        const newQuestion = new Question({
            survey: survey,
            question: question,
            type: type,
            userID: userID,



        })


        newQuestion.save((err, result) => {
            if (err) return console.log(err)
            console.log(result.id)
            console.log(result._id)
            console.log('saved to database')
            res.redirect(`/forms?survey=${result.survey}`, locals)
        })
    })

    app.delete('/forms', isLoggedIn, (req, res) => {
        db.collection('questions').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
        })
    })

    app.delete('/questions', (req, res) => {
        db.collection('questions').findOneAndDelete({ question: req.body.question }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('I am a baby squish quiche')
            res.send('Question deleted!')
        })
    })
    // Form Submissions ===================================================




    // Create new form submission
    // app.post('/forms/:id/answers'


    app.post('/forms/_id/answer', (req, res) => {
        console.log(req.body)
        const surveyID = req.body.surveyID
        const answer = req.body.answer
        const newAnswer = new Answer({
            surveyID: surveyID,
            answer: answer

        })

        newAnswer.save((err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect(`/thanks`)
        })

    })



    // List all submissions of a given form
    // app.get('/forms/:id/answers)

    // To get an individual form submission
    // app.get('/forms/:id/answers/:id'

    // Never look at all submissions across forms 
    // Fields in a given form would be different than other forms






    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/add', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/add', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------


};

// route middleware to ensure user is logged in
const isLoggedIn = (req, res, next) => {
    console.log(req.query)
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.query.isTaking === 'yes') {
        return next();
    }
    res.redirect('/');
}


