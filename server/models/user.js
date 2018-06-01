exports = module.exports = {};

module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: Sequelize.STRING(40),
        first_name: Sequelize.STRING(20),
        last_name: Sequelize.STRING(20),
        mobile: Sequelize.STRING(10),
        password: Sequelize.TEXT
    })
    return user;
}
