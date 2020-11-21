const User = require('../src/models/user')
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await User.findOne({where: { email: username}})
        if(!user){
            return done(null, false, { message: 'Incorrect username.' })
        }
        if(user.password !== password){
            return done(null, false, { message: 'Incorrect password.' })
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



