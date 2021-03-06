
const ObjectID = require('mongodb').ObjectID
const Question = require('./models/questions')
const Answer = require('./models/answers')
module.exports = (app, passport, db) => {


    // normal routes ===============================================================

    // Index Route
    app.get('/', (req, res) => {
        const locals = {
            title: 'Paper',
            loggedIn: req.isAuthenticated()
        }
        res.render('index', locals)
    })

    // About Route
    app.get('/about', (req, res) => {
        const locals = {
            loggedIn: req.isAuthenticated()
        }
        res.render('about', locals)
    })

    // Thanks Route
    app.get('/thanks', (req, res) => {
        const locals = {
            loggedIn: req.isAuthenticated()
        }
        res.render('thanks')
    })

    // Forms
    app.get('/forms', isLoggedIn, (req, res) => {

        console.log(req.query)
        let answerResult;
        Answer.find({ answer: req.query.answers }, (err, result) => {
            answerResult = result
        })
        console.log(req.body)
        Question.find({ survey: req.query.survey }, (err, result) => {
            console.log('this is the result:', result)
            const locals = {
                loggedIn: req.isAuthenticated(),
                answer: answerResult,
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
            loggedIn: req.isAuthenticated(),
            survey: req.query.survey ? req.query.survey : ''
        })
    })

    // Add Paper Form
    app.get('/add', isLoggedIn, (req, res) => {
        console.log('survey =', req.query.survey)
        res.render('add', {
            loggedIn: req.isAuthenticated(),
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
                loggedIn: req.isAuthenticated(),
                surveyList: surveyList
            })
        })
    })

    app.get('/deleteForm', (req, res) => {
        Question.deleteMany({ survey: req.query.survey }, err => {
            if (err) return console.log(err)
            res.redirect('/list', {
                loggedIn: req.isAuthenticated()
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
        console.log('post to /forms', req.body.survey)
        const survey = req.body.survey
        const question = req.body.question
        const type = req.body.type
        const userID = req.user._id
        const newQuestion = new Question({
            survey: survey,
            question: question,
            type: type,
            userID: userID,



        })


        newQuestion.save((err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect(`/forms?survey=${survey}`)
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

    app.post('/forms/_id/answer', (req, res) => {
        // console.log('this our answer: ', req.body.answer)

        const surveyID = req.body.surveyID
        const answer = req.body.answer
        const questionID = req.body.questionID
        const responseID = req.body.responseID
        console.log(req.body)
        for (let i = 0; i < answer.length; i++) {
            const newAnswer = new Answer({
                responseID: responseID,
                questionID: questionID[i],
                surveyID: surveyID[0],
                answer: answer[i]

            })
            console.log("this is new Answer:", newAnswer)

            newAnswer.save((err, result) => {
                if (err) return console.log(err)
                console.log('saved to database')
                if (i === answer.length - 1) {
                    res.redirect(`/thanks`)
                }

            })
        }


    })

    app.get('/answers', (req, res) => {

        console.log('this is our answer thing', req.query.surveyID)
        Answer.find({ surveyID: req.query.surveyID }, (err, answers) => {
            console.log('these are the answers:', answers)
            Question.find({ survey: req.query.surveyID }, (err, questions) => {
                console.log('these are the questions:', questions)
                let allAnswers = []
                for (let i = 0; i < questions.length; i++) {
                    // get each question ID
                    let questionText = questions[i].question;
                    let aandQ = answers.filter((answer) => {
                        return answer.questionID === questions[i].id
                    }).map((questionAnswer) => questionAnswer.answer);
                    console.log("this is our answer and questions", aandQ)
                    let QandAObj = {
                        question: questionText,
                        answers: aandQ,
                    }
                    allAnswers.push(QandAObj);
                    console.log(allAnswers);
                }
                const locals = {
                    answers: allAnswers,
                    loggedIn: req.isAuthenticated()

                }

                res.render('answers', locals)

            })


        })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', (req, res) => {
        res.render('login.ejs', {
            loggedIn: req.isAuthenticated(),
            message: req.flash('loginMessage')
        })
    })

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/add', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }))

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', {
            message: req.flash('signupMessage'),
            loggedIn: req.isAuthenticated()
        })
    })

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/add', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }))

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


