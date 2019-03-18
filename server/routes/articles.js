const express = require('express');
const router = express.Router();
const ArticleControlller = require('../controllers/articleController');
const images = require('../middlewares/image')
const { authentication, authorization } = require('../middlewares/verivy')

router.get('/', ArticleControlller.read)

router.use(authentication);

router.post('/',
  images.multer.single('image'),
  images.sendUploadToGCS,
  ArticleControlller.create
)

router.put('/:id',
  authorization, 
  images.multer.single('image'),
  images.sendUploadToGCS,
  ArticleControlller.update)

router.delete('/:id',
  authorization,
  ArticleControlller.delete)

module.exports = router;
