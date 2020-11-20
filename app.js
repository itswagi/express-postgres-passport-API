const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sequelize = require('./src/db/db')
const User = require('./src/models/user')
const app = express()
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await User.findOne({where: { email: username}})
        console.log(user.password)

        if(!user){
            return done(null, false, { message: 'Incorrect username.' })
        }
        if(user.password !== password){
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)

        /*if(!row){
            console.log('Not Found')
        }
        User.findOne({where: { email: username }}, function(err, user) {
            console.log(user)
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
            });*/
    }
));

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', passport.authenticate('local'), (req, res) => {
    console.log(req)
    res.send('Hello World')
  });

app.listen(process.env.PORT, async () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
    try{
        await sequelize.sync(
            //{force: true}
        )
        console.log('Connected to database')
    }catch(error){
        console.error(`Error: Cannot connect to database ${error}`)
    }
})