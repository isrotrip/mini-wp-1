const User = require('../models/user');
const Article = require('../models/article');
const jwtConvert = require('../helpers/jwtConvert');

module.exports = {
  authentication (req, res, next) {
    if(req.headers.token) {
      let user = jwtConvert.verify(req.headers.token) 
      User
        .findOne({
          email: user.email
        })
        .then(user => {
          if(user) {
            req.userLogin = user
            next();
          } else {
            res.status(400).json({
              message: 'Invalid Token Error'
            })
          }
        })
    } else {
      res.status(400).json({
        message: 'Invalid Token Error'
      })
    }
  },
  
  authorization (req, res, next) {
    Article
      .findById(req.params.id)
      .then(article => {
        if(req.userLogin._id.toString() === article.userId.toString()){
          next();
        } else {
          res.status(401).json({
            message: 'Not Authorized To Use This Feature'
          })
        }
      })
  }
}