module.exports = (app, db) => {

    //add user to database
    app.post('/data/createUser', (req, res) => {
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

    //get a user
    // app.post('/data/getuser', (req, res) => {
    //     console.log("database user route");
    //     mobile = req.body.mobile;
    //     db.user.findOne({
    //         mobile: mobile 
    //     })
    //     .then(foundUser => {
            
    //     })
    // })
}