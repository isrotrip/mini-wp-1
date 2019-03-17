const Article = require('../models/article');
const tagDevider = require('../helpers/tagDevider');
const tagCounter = require('../helpers/tagCounter');
const checkTagChanges = require('../helpers/checkTagChanges');

class ArticleController {

  static create(req, res) {
    console.log('test')
    if(!req.file) {
      res.status(400).json({
        message: 'Please input the picture'
      })
    } else {
      let promiseTags = tagDevider(req.body.tags);
      let allTags = [];
      let sendTags = [];
      let articleDefault = {};
      console.log(promiseTags)
      Promise
        .all(promiseTags)
        .then(tags => {
          tags.forEach(tag => {
            allTags.push(tag._id)
            sendTags.push(tag)
          })
          return Article
            .create({
              title: req.body.title,
              tags: allTags,
              content: req.body.content,
              pictureUrl: req.file.cloudStoragePublicUrl,
              userId: req.userLogin._id,
              created_at: new Date
            })
        })
        .then(article => {
          articleDefault = {
            _id: article._id,
            title: article.title,
            tags: sendTags,
            content: article.content,
            pictureUrl: article.pictureUrl,
            created_at: article.created_at,
            userId: req.userLogin
          };
          return tagCounter(article._id, allTags, [])
        })
        .then(tagStatus => {
          let objectStatus = {};
          tagStatus.forEach(status => {
            objectStatus = {...objectStatus, ...status}
          })
          let successMessage = {
            message: `Article with title ${articleDefault.title}`,
            article: articleDefault,
            tagStatus: objectStatus
          }
          res.status(201).json(successMessage);
        })
        .catch(error => {
          console.log(error)
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
  }

  static read(req, res) {
    Article
      .find({})
      .populate('tags')
      .populate('userId', '-password')
      .sort([['created_at', 'descending']])
      .then(articles => {
        if(articles) {
          res.status(200).json({
            message: 'Found The Article',
            articles: articles
          })
        } else {
          res.status(200).json({
            message: 'Article Not Found'
          })
        }
      })
      .catch(error => {
        res.status(500).json({
          message: error.message
        })
      })
  }

  static update(req, res) {
    let promiseTags = tagDevider(req.body.tags);
    let allTags = [];
    let sendTags = [];
    let articleDefault = {};
    Promise
      .all(promiseTags)
      .then(tags => {
        tags.forEach(tag => {
          allTags.push(tag._id)
          sendTags.push(tag)
        })
        return Article
          .findById(req.params.id)
      })
      .then(article => {
        let tagChanges = checkTagChanges(article.tags, allTags);
        article.title = req.body.title;
        article.tags = allTags;
        article.content = req.body.content;
        if(req.file) {
          article.pictureUrl = req.file.cloudStoragePublicUrl;
        }
        article.userId = req.userLogin._id;
        article.created_at = new Date
        article.save();
        articleDefault = {
          _id: article._id,
          title: article.title,
          tags: sendTags,
          content: article.content,
          pictureUrl: article.pictureUrl,
          created_at: article.created_at,
          userId: req.userLogin
        }
        return tagCounter(article._id, tagChanges.added, tagChanges.deleted)
      })
      .then(tagStatus => {
        let objectStatus = {};
        tagStatus.forEach(status => {
          objectStatus = {...objectStatus, ...status}
        })
        res.status(200).json({
          message: `Successfully update article with title ${articleDefault.title}`,
          article: articleDefault,
          tagStatus: objectStatus
        })
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: error.message
        })
      })
  }

  static delete(req, res) {
    let deletedArticle = {}
    Article
      .findByIdAndDelete(req.params.id)
      .then(article => {
        deletedArticle = article;
        return tagCounter(article._id, [], article.tags)
      })
      .then(tagStatus => {
        let objectStatus = {};
        tagStatus.forEach(status => {
          objectStatus = {...objectStatus, ...status}
        })
        res.status(200).json({
          message: `Successfully delete article with title`,
          article: deletedArticle,
          tagStatus: objectStatus
        })
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: error.message
        })
      })
  }

}

module.exports = ArticleController
