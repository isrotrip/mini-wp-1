require('dotenv').config()
const crypto = require('crypto');

module.exports = (password) => {
  return  crypto.createHmac('sha256', process.env.CRYPTO_SALT)
  .update(password)
  .digest('hex');
}