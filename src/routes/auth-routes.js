const express = require('express')
const passport = require('passport')
const authRouter = express.Router()
const sequelize = require('../db/db');
const { DataTypes } = require("sequelize");
const User = require('../models/user')(sequelize, DataTypes)

const isAuthenticated = (req,res,next) => {
    if(req.user)
       return next();
    else
       return res.status(401).json({
         error: 'User not authenticated'
       })
}

const isLoggedIn = (req,res,next) => {
    if(!req.user)
        return next()
    else
        return res.send('Already Logged in')
}

//Login User
authRouter.post('/login', isLoggedIn, passport.authenticate('local'), (req, res) => {
    res.status(200).send('Logged In Successful')
});

//Create User
authRouter.put('/register', isLoggedIn, async (req, res) => {
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

//Read User
authRouter.get('/status', async (req, res) => {
    const user_details = await User.findByPk(req.user.id)
    res.json(user_details)
})

//Update User
authRouter.put('/update', (req,res) => {
    User.findByPk(req.user.id).then(user => {
        user.password = req.query.password
        user.save().then(user => {
            if(!user){
                return res.status(404).send('User not found')
            }
            res.json({message: 'Successfully Updated'})
        }
        ).catch(err => {
            return res.status(400).send('Error')
        })
    })
})

//Delete User
authRouter.delete('/delete', async (req, res) => {
    try{
        await User.destroy({where: {id: req.user.id}})
        res.status(204)
    }catch(err){
        res.send(400)
    }
    
})

authRouter.post('/logout', (req, res) => {
    req.logout()
    res.status(204).send()
})

module.exports = authRouter
