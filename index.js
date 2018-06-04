const express = require('express');
const db = require('./server/db');
const databaseRouter = require('./server/router/index');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const router = express.Router();

const PRIVATE_KEY = "myprivatekey";

app.use('/nodejstest', router);
app.use(express.static('css'));
router.use(bodyParser());
router.use(cookieParser());

//for database operations
databaseRouter(router, db);

router.get('/', function(req, res){
    console.log('Signup page');
    res.sendFile('./signup.html', {root: __dirname});
})

router.get('/login', (req, res) => 
    res.sendFile('./login.html', {root: __dirname})
);

//modify user data
router.put('/putUser', (req, res) => {
    const mobile = req.query.mobile;
    const token = req.query.token;
    const newFName = req.query.fName;
    const newLName = req.query.lName;
    const newPass = req.query.pass;
    let userToModify;

    db.user.findOne({
        mobile: mobile 
    })
    .then(foundUser => {
        userToModify = foundUser;
        jwt.verify(token, PRIVATE_KEY, (err, dec) => {
            if (err)
                throw Error('Token Validation Error');
        });
    })
})

//Login the user and create JWT token
router.post('/loginUser', (req, res) => {
    mobile = req.body.mobile;
    db.user.findOne({
        mobile: mobile 
    })
    .then(foundUser => {
        console.log(foundUser.mobile);
        const token = jwt.sign(foundUser.mobile, PRIVATE_KEY);
        res.cookie('NodeJSTestToken', token, {maxAge: 60000})
        res.cookie('userMobile', mobile, {maxAge: 60000});
        res.send("Login Successful");
        //res.header('authorization', {token});
    })
});

//Checks token validation
router.get('/data/user', (req, res) => {
    //const token = req.cookies['NodeJSTestToken'];
    const token = req.query.token;
    const mobile = req.query.mobile;
    db.user.findOne({
        mobile: mobile 
    })
    .then(foundUser => {
        jwt.verify(token, PRIVATE_KEY, (err, dec) => {
            if (err)
                res.send("Authentication error");
            else
                res.send("Token validated");
        });
        //res.json({token: token});
    })
})

function ensureToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else
        req.sendStatus(403);
}

db.sequelize.sync().then(() => {
    app.listen(3000)
})