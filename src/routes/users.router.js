const express = require('express');
const usersRenderController = require('../controllers/usersRenderController.js')
const userController = require('../controllers/usersController.js');
const productsController = require('../controllers/productsController.js');
const { isAuthenticated, isNotAuthenticated } = require ('../middleware/auth.js');
const { isPremium } = require('../middleware/auth.js')

const router = express.Router();

router.get('/login', isNotAuthenticated, usersRenderController.renderLogin);

router.get('/register', isNotAuthenticated, usersRenderController.renderRegister);

router.get('/current', isAuthenticated, usersRenderController.renderProfile);

router.get('/user', isAuthenticated, usersRenderController.renderUser);

router.get('/productsUsersPremium', isPremium, productsController.productsUsersPremium);

router.get('/request-password', usersRenderController.renderRecuperarPassword)

router.post('/request-password-reset', userController.requestPasswordReset)

router.get('/reset-password', usersRenderController.renderResetPassword);

router.post('/reset-password', userController.resetPassword )

module.exports = router;
