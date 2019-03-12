const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authentication } = require('../middlewares/verivy')

/* GET users listing. */
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/verify', authentication, UserController.verify)

module.exports = router;
