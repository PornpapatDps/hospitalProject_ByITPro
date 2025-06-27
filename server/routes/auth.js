const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authControllers = require('../controllers/auth');
// const  handleRefreshToken  = require('../controllers/refreshToken');

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.get('/users', authControllers.users);
module.exports = router;
