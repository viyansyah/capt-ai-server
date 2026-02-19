const express = require('express')
const router = express.Router()

const userRouter = require('./user')
const captionRouter = require('./caption')

router.use('/users', userRouter)
router.use('/captions', captionRouter)

module.exports = router
