const express = require('express')
const UserController = require('./controllers/userController')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/login",UserController.login)
app.use("/api/register",UserController.register )




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
