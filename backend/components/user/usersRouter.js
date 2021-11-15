const express = require('express');
const usersController = require('./usersController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const { permissionAccess } = require('../../middlewares/permissionAccess');

const router = express.Router();

router
  .get('/', catchAsyncError(usersController.getAllUser))
  .get('/:id', catchAsyncError(usersController.getUser))
  .get('/:id/friends', catchAsyncError(usersController.userFriends))
  .get('/:id/fof', catchAsyncError(usersController.friendsOfFriends))
  .get('/:id/suggestedfriends', catchAsyncError(usersController.suggestedFriends));

module.exports = router;
