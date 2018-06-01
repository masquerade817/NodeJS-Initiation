exports = module.exports = {};

const database = 'NodeJSTest';
const username = 'root';
const password = 'gaurang2018';
const hostname = 'localhost';

const Sequelize = require('sequelize');
const sequelize = new Sequelize(database, username, password, {
		host: hostname,
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
});

const db = {};
db.user = require('./models/user')(sequelize, Sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;