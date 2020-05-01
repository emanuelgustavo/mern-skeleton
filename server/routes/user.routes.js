import express from 'express';
import userController from '../controllers/user.controller.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/users')
  .get(userController.list)
  .post(userController.create);

router.route('/api/users/:userId')
  .get(authController.requireSignin,
    userController.read)
  .put(authController.requireSignin,
    authController.hasAuthorization,
    userController.update)
  .delete(authController.requireSignin,
    authController.hasAuthorization,
    userController.remove);

router.param('userId', userController.userByID);

export default router;