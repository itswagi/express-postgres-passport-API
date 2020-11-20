const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sequelize = require('./src/db')
const app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.listen(process.env.PORT, async () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
    try{
        await sequelize.sync(
            //{force: true}
        )
        console.log('Connect to database')
    }catch(error){
        console.error(`Error: Cannot connect to database ${error}`)
    }
})