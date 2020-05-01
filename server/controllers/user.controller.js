import User from '../models/user.model.js';
import _ from 'loadsh';
import errorHandler from './error.controller.js';

const create = (req, res, next) => {
  const user = new User(req.body);
  user.save((error, result) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }
    res.status(200).json({
      message: 'Succesfully signed up!'
    });
  });
 };

const list = (req, res) => {
  User.find((error, users) => { 
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }
    res.json(users);
  }).select('Name email updated created');
};

const userByID = (req, res, next, id) => { 
  User.findById(id).exec((error, user) => { 
    if (error || !user) {
      return res.status('400').json({
        error: 'User not found'
      });
    }
    req.profile = user;
    next();
  });
};

const read = (req, res) => { 
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.update = Date.now();
  user.save(error => { 
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
 };

const remove = (req, res, next) => {
  let user = req.profile;
  user.remove((error, deletedUser) => { 
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  });
 };

export default {
  create,
  list,
  userByID,
  read,
  update,
  remove
};