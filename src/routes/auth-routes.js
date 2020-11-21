const express = require('express')
const passport = require('passport')
const authRouter = express.Router()

const isAuthenticated = (req,res,next) => {
    if(req.user)
       return next();
    else
       return res.status(401).json({
         error: 'User not authenticated'
       })
}


authRouter.get('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged In Successful')
});
authRouter.use(isAuthenticated)
authRouter.get('/m', (req, res) => {
    res.send('Messages')
})

authRouter.get('/check', (req, res) => {
    res.status(200).json({status: 'Confirmed'})
})
authRouter.get('/logout', (req, res) => {
    req.logout()
    res.send('log out successful')
})

module.exports = authRouter
