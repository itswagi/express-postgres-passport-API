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
        if(!user){
            return done(null, false, { message: 'Incorrect username.' })
        }
        if(user.password !== password){
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
    }
));

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())


app.get('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged In Successful')
});

app.get('/m', (req, res) => {
    console.log('Messages Endpoint')
    res.send('Messages')
})

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