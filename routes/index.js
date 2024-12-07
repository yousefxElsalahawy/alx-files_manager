#!/usr/bin/node

const express = require('express');
const SystemController = require('../controllers/AppController');
const UserHandler = require('../controllers/UsersController');
const AuthenticationHandler = require('../controllers/AuthController');

const apiRouter = express.Router();

// Define routes
apiRouter.get('/status', SystemController.getStatus);
apiRouter.get('/stats', SystemController.getStats);
apiRouter.post('/users', UserHandler.postNew);
apiRouter.get('/connect', AuthenticationHandler.getConnect);
apiRouter.get('/disconnect', AuthenticationHandler.getDisconnect);
apiRouter.get('/users/me', AuthenticationHandler.getMe);

module.exports = apiRouter;