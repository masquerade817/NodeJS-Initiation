var express = require('express');
var app = express();
 
var router = express.Router();
var db = require('./server/db');
const databaseRouter = require('./server/router/index');

const bodyParser = require('body-parser');

app.use('/nodejstest', router);
app.use(express.static('css'));
router.use(bodyParser());
databaseRouter(router, db);

router.get('/', function (req, res) {
    console.log('root');
    res.redirect('/nodejstest/user');
})

router.get('/user', function(req, res){
    console.log('To signup page');
    res.sendFile('./signup.html', {root: __dirname});
})

//router.post('/user', (config));

router.get('/login', (req, res) => res.sendFile('./login.html', {root: __dirname}));

db.sequelize.sync().then(() => {
    app.listen(3000)
})