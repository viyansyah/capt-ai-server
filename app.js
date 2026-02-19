require('dotenv').config()
const express = require('express')
const UserController = require('./controllers/userController')
const CaptionController = require('./controllers/captionController')
const authentication = require('./middlewares/auth')
const upload = require('./middlewares/multer')
const app = express()
const port = 3007


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/api/login",UserController.login)
app.post("/api/register",UserController.register )

app.post("/api/caption",authentication,upload.single('image'),CaptionController.addCaption)
app.get("/api/caption",authentication,CaptionController.readCaption)
app.delete("/api/caption/:id",authentication,CaptionController.deleteCaption)
app.put("/api/caption/:id",authentication,CaptionController.updateCaption)







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
