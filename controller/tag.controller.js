const Tag = require('../models/tag');

exports.getAll = async (req, res) => {
    Tag.getTags(req, res);
}