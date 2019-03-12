const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashPassword = require('../helpers/hashPassword');

const userSchema =  new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: [{
      validator: function(value) {
        return User
          .find({
            email: value
          })
          .then(user => {
            if(user.length === 0) {
              return true;
            } else {
              return false;
            }
          })
      }, message: 'Email has been taken'
    }, {
      validator: function(value) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
      }, message: 'Email format wrong'
    }]
  },
  password: {
    type: String,
    required: true
  },
  loginVia: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  this.password = hashPassword(this.password);
  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;