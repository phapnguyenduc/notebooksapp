const User = require('../models/user');

exports.createUser = async (req, res, next) => {
    User.createUser(req, res, next);
}