const Article = require('../models/article');
const Tag = require('../models/tag');

class ArticleController {

  static create(req, res) {
    let makeTagUnique = [];
    let objectTag = {};
    req.body.tags.split(' ').forEach(tag => {
      objectTag[tag] = 0
    });
    makeTagUnique = Object.keys(objectTag);
    let newArticle = {}
    let newTags = []
    Article
      .create({
        title: req.body.title,
        descriptions: req.body.descriptions,
        tags: makeTagUnique,
        content: req.body.content,
        pictureUrl: req.pictureUrl,
        userId: req.userLogin._id
      })
      .then(article => {
        newArticle = article
        let tagPromise = null;
        article.tags.forEach(tag => {
          tagPromise
            .push(new Promise((resolve, reject) => {
              Tag
                .findOne({
                  name: tag.name
                })
                .then(tag => {
                  if(tag) {
                    resolve('')
                  } else {
                    resolve(tag)
                  }
                })
                .catch(error => {
                  reject(error)
                })    
          }))
        })
        return Promise.all(tagPromise)
          .then(tag => {
            newTags.push(tag)
            Tag.create({
              name: tag.name
            })
          })
      })
      .then(status => {
        res.json(201).json({
          message: `Article with name ${newArticle.name}`,
          newArticle: newArticle,
          newTags: newTags 
        })
      })
      .catch(error => {
        if(error.message.indexOf('validation') === - 1) {
          let errorMessage = {
            message: 'Internal Server Error',
            full_massage: error
          }; 
          res.status(500).json(errorMessage);
        } else {
          let errorMessage = {
            message: error.message,
            full_massage: error
          }
          res.status(400).json(errorMessage)
        }
      })
  }

  static read(req, res) {
    Article
      .find({
        userId: req.userLogin._id
      })
      .then(articles => {
        res.status(200).json({
          data: articles
        })
      })
      .catch(error => {
        res.status(500).json({
          message: error.message
        })
      })
  }

  static update(req, res) {
    Article
      .findById(req.params.id, {
        new: true
      })
      .then(article => {
        let oldTags = article.tags;
        article.title = req.body.title;
        article.descriptions = req.body.descriptions;
        article.tags = req.body.makeTagUnique;
        article.content = req.body.content;
        article.pictureUrl = req.pictureUrl
        article.save();
        let removeFromTags = [];
        let addFromTags = [];
        for(let i = 0; i < oldTags.length; i++) {
          for(let j = 0; j < article.tags.length; j++) {
            
          }
        }
      })
      .catch(error => {
        res.status(500).json({
          message: error.message
        })
      })
  }

  static delete(req, res) {
    
  }

}

module.exports = ArticleController
