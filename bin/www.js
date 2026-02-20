if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const app = require("../app")
const port = process.env.PORT || 3400


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
