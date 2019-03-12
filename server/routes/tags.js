const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

/* GET users listing. */
router.get('/article', TagController.login);
router.post('/register', TagController.register);

module.exports = router;
