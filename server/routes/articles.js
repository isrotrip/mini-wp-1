const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

/* GET users listing. */
router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;
