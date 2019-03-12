require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
  sign(user) {
    return jwt.sign(user, process.env.JWT_SECRET);
  }
}