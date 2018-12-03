
const ObjectID = require('mongodb').ObjectID
const Paper = require('./models/paper')
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

    // Forms
    app.get('/forms', (req, res) => {


        console.log(req.query)

        db.collection('paper').findOne({ "_id": ObjectID(req.query.id) }, (err, result) => {
            const locals = {
                questions: result
            }
            res.render('forms', locals)
            // const qu = {
            //     question: result.question
            // }

        })
        // Get the form id out of url params
        // Use the form id to look up form from db
        // Input that into a variable
        // Give the variable to ejs to render page
        // Pray to computer godesses that render page works somehow
    })

    // Edit Form
    app.get('/edit', (req, res) => {
        Form.findOne({
            _id: req.params.id
        })
            .then(form => {
                res.render('/edit', {
                    idea: idea
                })
            })
    })

    // Add Paper Form
    app.get('/add', (req, res) => {
        res.render('add')
    })

    // LOGOUT ==============================
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Form routes ===============================================================


    app.post('/forms', (req, res) => {
        console.log(req.body)
        const title = req.body.title
        const question = req.body.question
        const type = req.body.type
        const newPaper = new Paper({
            title: title,
            question: question,
            type: type
        })

        // set the user's local credentials


        newPaper.save((err, result) => {
            if (err) return console.log(err)
            console.log(result.id)
            console.log(result._id)
            console.log('saved to database')
            res.redirect(`/forms?id=${result.id}`)
        })
    })

    // app.put('/forms', (req, res) => {
    //     const newPaper = new Paper()

    //     // set the user's local credentials
    //     newPaper.question = req.body.question

    //     newPaper.save((err, result) => {
    //         if (err) return console.log(err)
    //         console.log('saved to database')
    //         res.redirect('forms')
    //     })

    //     db.collection('paper')
    //         .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
    //             $set: {
    //                 thumbUp: req.body.thumbUp + 1
    //             }
    //         }, {
    //                 sort: { _id: -1 },
    //                 upsert: true
    //             }, (err, result) => {
    //                 if (err) return res.send(err)
    //                 res.send(result)
    //             })
    // })

    app.delete('/forms', (req, res) => {
        db.collection('paper').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
        })
    })

    // Form Submissions ===================================================





    // Create new form submission
    // app.post('/forms/:id/submit'

    // List all submissions of a given form
    // app.get('/forms/:id/submissions)

    // To get an individual form submission
    // app.get('/forms/:id/submissions/:id'

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
    app.get('/unlink/local', isLoggedIn, (req, res) => {
        const user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save((err) => {
            res.redirect('/form');
        });
    });

};

// route middleware to ensure user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


