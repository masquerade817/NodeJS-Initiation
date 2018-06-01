const express = require('express');
const db = require('./server/db');
const databaseRouter = require('./server/router/index');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();

const PRIVATE_KEY = "myprivatekey";

app.use('/nodejstest', router);
app.use(express.static('css'));
router.use(bodyParser());

//for database operations
databaseRouter(router, db);

router.get('/', function(req, res){
    console.log('Signup page');
    res.sendFile('./signup.html', {root: __dirname});
})

router.get('/login', (req, res) => 
    res.sendFile('./login.html', {root: __dirname})
);

router.post('/login', (req, res) => {
    mobile = req.body.mobile;
    db.user.findOne({
        mobile: mobile 
    })
    .then(foundUser => {
        const token = jwt.sign(foundUser, PRIVATE_KEY);
        res.header('authorization', {token});
    })
});

router.get('/user', ensureToken, (req, res) => {
    mobile = req.body.mobile;
    db.user.findOne({
        mobile: mobile 
    })
    .then(foundUser => {
        const token = jwt.sign(foundUser, PRIVATE_KEY);
        res.json({token: token});
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