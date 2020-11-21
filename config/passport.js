const sequelize = require('../src/db/db');
const { DataTypes } = require("sequelize")
const User = require('../src/models/user')(sequelize, DataTypes)
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await User.findOne({where: { username: username}})
        if(!user){
            return done(null, false)
        }
        if(!user.validPassword(password)){
            return done(null, false)
        }
        return done(null, user)
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findByPk(id).then(function(user) { done(null, user); });
});



