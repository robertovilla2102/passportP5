const S = require('sequelize')
const db = require('../db/index')
const crypto = require('crypto')

class User extends S.Model { }
User.init({
    email: {
        type: S.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: S.STRING,
        allowNull: false
    },

    salt: {
        type: S.STRING
    }
}, { sequelize: db, modelName: 'user' })

User.addHook('beforeCreate', user => {
    user.salt = crypto.randomBytes(20).toString('hex')
    user.password = user.hashPassword(user.password)
})

User.prototype.hashPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

User.prototype.validPassword = function (password) {
    return this.password === this.hashPassword(password)
}


module.exports = User