const TABLE = "tag";
const mysql = require('../db_connection');

/**
 * Get all of tags
 * 
 * @param {*} req 
 * @param {*} res 
 * @return array of tags
 */
function getTags(req, res) {
    try {
        var sql = "SELECT * FROM tag";
        mysql.query(sql, function (err, result) {
            if (err) throw err;

            res.status(200).send({
                data: result,
                message: "Load tags successfully"
            });
        });
    } catch (error) {
        res.status(500).send({
            data: [],
            message: error.message
        });
    }
}

function createTag() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

function deleteTag() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

function updateTag() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getTags,
    createTag,
    deleteTag,
    updateTag
}