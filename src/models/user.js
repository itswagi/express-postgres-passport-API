const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');
const bcrypt = require('bcrypt')

module.exports = function(sequelize, Sequelize) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },{
        timestamps: false,
        
    })
    User.prototype.validPassword = function(password){
        console.log(password)
        console.log(this.password)
        return bcrypt.compare(this.password, password)
    }
    User.beforeCreate(async (user, options) => {
        return user.password = await bcrypt.hash(user.password, 10)
      });
    return User
}
