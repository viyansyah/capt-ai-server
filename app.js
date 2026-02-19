require('dotenv').config()
const express = require('express')
const router = require('./router')
const errorHandler = require('./middlewares/errorHandler')
const app = express()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api",router)
app.use(errorHandler)




module.exports = app
