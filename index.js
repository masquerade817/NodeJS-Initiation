const express = require('express');
const db = require('./server/db');
const databaseRouter = require('./server/router/index');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const router = express.Router();

const PRIVATE_KEY = "myprivatekey";
const COOKIE_MAX_AGE = 120000; //2min
const JWT_MAX_AGE = 1000 * 60 * 60 * 1; //1hr
const SALT_ROUNDS = 10;

app.use('/nodejstest', router);
app.use(express.static('css'));

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
  }));
router.use(cookieParser());

//for database operations
//databaseRouter(router, db);

router.get('/', function(req, res){
    console.log('Signup page');
    res.sendFile('./signup.html', {root: __dirname});
})

router.get('/login', (req, res) => 
    res.sendFile('./login.html', {root: __dirname})
);

function throwError(message){
    throw new Error(message);
}

router.post('/data/createUser', (req, res) => {
    let fName, lName, email, mobile, plaintextPassword, allDataProvided = true;
    try{
        isSet(req.body.fName) ? fName = req.body.fName: throwError('Error');
        isSet(req.body.lName) ? lName = req.body.lName: throwError('Error');
        isSet(req.body.email) ? email = req.body.email: throwError('Error');
        isSet(req.body.mobile) ? mobile = req.body.mobile: throwError('Error');
        isSet(req.body.pass) ? plaintextPassword = req.body.pass: throwError('Error');
        isSet(req.body.cpass) ? cpass = req.body.cpass: throwError("Error");

        if (plaintextPassword != cpass)
            throwError("Password Doesn't Match")
    }catch(err){
        allDataProvided = false;
        res.send('Data not provided');
    }

    if (allDataProvided){
        bcrypt.hash(plaintextPassword, SALT_ROUNDS)
            .then(hash => {
                return db.user.create({
                    email: req.body.email,
                    first_name: req.body.fName,
                    last_name: req.body.lName,
                    mobile: req.body.mobile,
                    password: hash
                })
            })
            .then(newUser => {
                res.redirect('/nodejstest/login');
            })
    }
})

//modify user data
router.put('/putUser', ensureToken, (req, res) => {

    const mobile = req.query.mobile;
    const token = req.query.token;

    const user = {};
    //If a parameter is set, add it to user object. Else, do nothing.
    typeof req.query.fName != 'undefined' ? user.first_name = req.query.fName: {};
    typeof req.query.lName != 'undefined' ? user.last_name = req.query.lName: {};
    typeof req.query.pass != 'undefined' ? user.password = req.query.pass: {};

    let userToModify;

    if (isSet(mobile)){
        bcrypt.hash(user.password, SALT_ROUNDS)             //hash password
            .then(hash => user.password = hash)             //store hash password in user
            .then(() => {
                db.user.findOne({
                    where: {mobile: mobile}
                })
            })
            .then(foundUser => {
                userToModify = foundUser;
                return db.user.update(user, {where: {mobile: mobile}})
            })
            .then((i) => {
                console.log("test");
                if (i[0] === 0)             //Error
                    res.send('Invalid mobile number');
                else
                    res.send('Row updated')
            })
    }
})

//Login the user and create JWT token
router.post('/loginUser', (req, res) => {
    
    let mobile, plaintextPassword, allDataProvided = true, user;
    try{
        isSet(req.body.mobile) ? mobile = req.body.mobile: throwError('Error');
        isSet(req.body.pass) ? plaintextPassword = req.body.pass: throwError('Error');
    }catch(err){
        allDataProvided = false;
        res.send('Data not provided');
    }

    if (allDataProvided){
        db.user.findOne({
            attributes: ['mobile','password'],
            where: {mobile: mobile}
        })
        .then(foundUser => {
            user = foundUser;
            return bcrypt.compare(plaintextPassword, foundUser.password)
        })
        .then(result => {
            if (result){
                const token = jwt.sign(user.mobile, PRIVATE_KEY);
                res.cookie('Token', token, {maxAge: JWT_MAX_AGE})
                res.send("Login Successful");
            }
            else
                res.send('Wrong Password');
        })
        .catch((err) => {
            console.log(err);
            res.send('Login Unsuccessful')
        })
    }
});

//Checks token validation
router.get('/data/user', ensureToken, (req, res) => {
    //const token = req.cookies['Token'];
    const mobile = req.query.mobile;

    if (!isSet(mobile))
        res.send('Mobile number not set');
    else{
        db.user.findOne({
            attributes: ['mobile', 'email'],
            where: {mobile: mobile}
        })
        .then((user) => {
            res.send(JSON.stringify(user));
        })
    }
})

//Ensures if JWT token is present and is legit
function ensureToken(req, res, next){
    const mobile = req.query.mobile;
    const token = req.cookies['Token'];
    if (isSet(token)){
        req.token = token;
        jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
            if (err || decoded != mobile)
                res.status(403).end('Unauthorized');
            else
                next();
        })
    }
    else
        res.status(403).end('Unauthorized');
}

function isSet(variable){
    if (typeof variable === 'undefined')
        return false;
    return true;
}

db.sequelize.sync().then(() => {
    app.listen(3000);
})