const Tag = require('../models/tag');

class TagController {

  static read(req, res) {
    Tag
      .create({
        name: req.body.name,
        articleId: req.params.articleId
      })
      .then(tag => {
        let successMessage = {
          message: `Tag with name ${tag.name} has beend added successfully`,
          data: tag
        }
        res.status(201).json(successMessage)
      })
      .catch(error => {
        res.status(500).json({
          message: error.message
        })
      })
  }

}

module.exports = TagController
