const Tag = require('../models/tag');

class TagController {

  static read(req, res) {
    Tag
      .find({})
      .then(tags => {
        if(tags) {
          let successMessage = {
            message: "Tag Found",
            tags: tags
          }
          res.status(200).json(successMessage)
        } else {
          res.status(200).json({
            message: "Tag Not Found",
            tags: []
          })
        }
      })
      .catch(error => {
        res.status(500).json({
          message: error.message
        })
      })
  }

}

module.exports = TagController
