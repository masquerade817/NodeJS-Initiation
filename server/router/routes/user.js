module.exports = (app, db) => {

    //create user
    app.post('/user', (req, res) => {
        db.user.create({
            email: req.body.email,
            first_name: req.body.fName,
            last_name: req.body.lName,
            mobile: req.body.mobile,
            password: req.body.pass
        })
        .then(newUser => {
            console.log('Signup Done');
            res.redirect('/nodejstest/login');
        })
    })


}