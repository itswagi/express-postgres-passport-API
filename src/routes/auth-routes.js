const express = require('express')
const passport = require('passport')
const authRouter = express.Router()
const sequelize = require('../db/db');
const { DataTypes } = require("sequelize")
const User = require('../models/user')(sequelize, DataTypes)

const isAuthenticated = (req,res,next) => {
    if(req.user)
       return next();
    else
       return res.status(401).json({
         error: 'User not authenticated'
       })
}

authRouter.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged In Successful')
});

authRouter.put('/register', async (req, res) => {
    console.log(req.query)
    await User.create({username: req.query.username, password: req.query.password})
    res.status(201).send('Registered')
})
authRouter.use(isAuthenticated)

authRouter.post('/logout', (req, res) => {
    req.logout()
    res.send('log out successful')
})

module.exports = authRouter
