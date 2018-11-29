module.exports = (app, passport, db) => {
    const Paper = require('./models/paper')

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
        const id
        res.render('forms')
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

    app.post('/add', (req, res) => {
        console.log('here i am')
        const newPaper = new Paper()

        // set the user's local credentials
        newPaper.question = req.body.question

        newPaper.save((err, result) => {
            console.log(result.id)
            console.log(result._id)
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/forms')
        })
    })

    app.post('/forms', (req, res) => {
        const newPaper = new Paper()

        // set the user's local credentials
        newPaper.question = req.body.question

        newPaper.save((err, result) => {
            if (err) return console.log(err)
            console.log(result.id)
            console.log(result._id)
            console.log('saved to database')
            res.redirect(`/forms?id=${result.id}`)
        })
    })

    app.put('/forms', (req, res) => {
        const newPaper = new Paper()

        // set the user's local credentials
        newPaper.question = req.body.question

        newPaper.save((err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('forms')
        })

        db.collection('paper')
            .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
                $set: {
                    thumbUp: req.body.thumbUp + 1
                }
            }, {
                    sort: { _id: -1 },
                    upsert: true
                }, (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                })
    })

    app.delete('/forms', (req, res) => {
        db.collection('paper').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
        })
    })

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
