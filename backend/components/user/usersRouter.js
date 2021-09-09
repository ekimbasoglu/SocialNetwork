const express = require('express');
const usersController = require('./usersController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { permissionAccess } = require('../../middlewares/permissionAccess');

const router = express.Router();

router
  .get('/', catchAsyncError(usersController.getAllUser))
  .get('/:id', catchAsyncError(usersController.getUser))
  .get('/friends/:id', catchAsyncError(usersController.getUserFriends))
  .get('/fof/:id', catchAsyncError(usersController.getUserFof))
  .get('/sf/:id', catchAsyncError(usersController.getUserSf));

module.exports = router;
