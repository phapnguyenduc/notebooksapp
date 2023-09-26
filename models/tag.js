const TABLE = "tag";
const mysql = require('../db_connection');


function getTags(req, res) {
    try {
        var sql = "SELECT * FROM tag";
        mysql.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.send(error.message);
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