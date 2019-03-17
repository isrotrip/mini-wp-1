const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

router.get('/', TagController.read);

module.exports = router;
