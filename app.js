const express = require('express')
require('dotenv').config()
const session    = require('express-session');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sequelize = require('./src/db/db')
const User = require('./src/models/user')
const app = express()
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
/*
passport.deserializeUser(function (id, done) {
      console.log('des')
      console.log(User.findByPk(id))
      
      
      User.findByPk(id, function(err, user) {
        done(err, user);
      });
})*/

passport.deserializeUser(function(id, done) {
    User.findByPk(id).then(function(user) { done(null, user); });
});

const isAuthenticated = (req,res,next) => {
    console.log('p1')
    if(req.user)
       return next();
    else
       return res.status(401).json({
         error: 'User not authenticated'
       })
 
 }


app.use(bodyParser.json())
app.use(morgan('dev'))

app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true}));
app.use(passport.initialize())
app.use(passport.session())


app.get('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged In Successful')
});

app.get('/m', isAuthenticated, (req, res) => {
    console.log('Messages Endpoint')
    res.send('Messages')
})

app.get('/check', isAuthenticated, (req, res) => {
    console.log(req.session)
    console.log(req.user)
    console.log('1')
    res.status(200).json({status: 'Confirmed'})
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