const express = require('express')
const router = express.Router()
const CaptionController = require('../controllers/captionController')
const authentication = require('../middlewares/auth')
const upload = require('../middlewares/multer')


router.use(authentication)

router.post('/', upload.single('image'), CaptionController.addCaption)
router.get('/', CaptionController.readCaption)
router.delete('/:id', CaptionController.deleteCaption)
router.put('/:id', CaptionController.updateCaption)

module.exports = router
