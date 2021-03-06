const express = require('express')
require('dotenv').config()
const session    = require('express-session');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sequelize = require('./src/db/db')
const app = express()
const passport = require('passport')
const YAML = require('yamljs')
require('./config/passport')
const authRouter = require('./src/routes/auth-routes')
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = YAML.load('./swagger.yaml');
    

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized:true}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/user', authRouter)

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