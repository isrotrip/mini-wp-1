require('dotenv').config();
const User = require('../models/user');
const googleDecoder = require('../helpers/googleDecoder');
const jwtConvert = require('../helpers/jwtConvert');
const hashPassword = require('../helpers/hashPassword');

class UserController {

  static login (req, res) {
    if(req.body.loginVia === 'google') {
      if(req.body.google_token) {
        googleDecoder(req.body.google_token)
          .then(loginUser => {
            return User
              .findOne({
                email: loginUser.email
              })
              .then(user => {
                if(user) {
                  let userInfo = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    loginVia: 'google'
                  };
                  let token = jwtConvert.sign(userInfo);
                  let successMessage = {
                    message: `Welcome ${userInfo.name}`,
                    token: token,
                    userInfo: userInfo
                  }
                  res.status(200).json(successMessage);
                } else {
                  let userInfo = {
                    name: loginUser.name,
                    email: loginUser.email,
                    password: process.env.DUMMY_GOOGLE_PASSWORD,
                    loginVia: 'google'
                  };
                  return User
                    .create(userInfo)
                    .then(user => {
                      let userInfo = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        loginVia: user.loginVia
                      };
                      let token = jwtConvert.sign(userInfo);
                      let successMessage = {
                        message: `Welcome ${userInfo.name}`,
                        token: token,
                        userInfo: userInfo
                      };
                      res.status(201).json(successMessage);
                    })
                }
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
          
      } else {
        res.status(400).json({
          message: 'Invalid Google Token'
        })
      }
    } else if (req.body.loginVia === 'website') {
      if(!req.body.email || !req.body.password) {
        res.status(400).json({
          message: 'Please fill Email/Password'
        })
      } else {
        User
          .findOne({
            email: req.body.email,
            password: hashPassword(req.body.password)
          })
          .then(user => {
            if(user) {
              let userInfo = {
                _id: user._id,
                name: user.name,
                email: user.email,
                loginVia: 'website'
              };
              let token = jwtConvert.sign(userInfo);
              let successMessage = {
                message: `Welcome ${userInfo.name}`,
                token: token,
                userInfo: userInfo
              }
              res.status(200).json(successMessage);
            } else {
              res.status(400).json({
                message: 'Wrong Email/Password'
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
  }

  static register (req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(400).json({
        message: 'Please fill Email/Password'
      })
    } else {
      let user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        loginVia: 'website'
      }
      User
        .create(user)
        .then(user => {
          let successMessage = {
            message: `Email ${user.email} have been successfully registered`,
            user: {
              id: user._id,
              email: user.email,
              loginVia: user.loginVia
            }
          };
          res.status(201).json(successMessage);
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
  }


  static verify (req, res) {
    let userInfo = {
      _id: req.userLogin._id,
      name: req.userLogin.name,
      email: req.userLogin.email,
      loginVia: req.userLogin.loginVia
    };
    let token = jwtConvert.sign(userInfo);
    let successMessage = {
      message: `Welcome ${userInfo.name}`,
      token: token,
      userInfo: userInfo
    };
    res.status(200).json(successMessage);
  }

}

module.exports = UserController;