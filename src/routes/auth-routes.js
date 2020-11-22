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
    res.status(200).send('Logged In Successful')
});

authRouter.put('/register', async (req, res) => {
    try{
        if (req.query.password === ""){
            throw {errors: [{message: 'Invalid Password'}], error: new Error()}
        }
        await User.create({username: req.query.username, password: req.query.password})
        res.status(201).send('Registered')
    }catch(err){
        res.status(400).json(err.errors[0].message)
    }
    
})
authRouter.use(isAuthenticated)

authRouter.post('/logout', (req, res) => {
    req.logout()
    res.status(204).send()
})

module.exports = authRouter
