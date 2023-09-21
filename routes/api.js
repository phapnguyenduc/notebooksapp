const express = require('express');
const mysql = require('../db_connection');

const router = express.Router();

router.post("/note/create", async (req, res) => {
    try {
        var sql = "INSERT INTO note (content) VALUES ?";
        var values = [
            [req.body.content]
        ];
        mysql.query(sql, [values], function (err, result) {
            if (err) throw err;
            res.send("Number of records inserted: " + result.affectedRows);

            // Insert to note_tag table
            const dataInsert = req.body.tags.map((ob) => {
                return [result.insertId, ob]
            });
            mysql.query("INSERT INTO note_tag (note_id, tag_id) VALUES ?", [dataInsert], function (err, result) {
                if (err) throw err;
            })
        });
    } catch (error) {
        res.send(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        var sql = "SELECT * FROM note";
        mysql.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.send(error.message);
    }
});

router.get("/tags", async (req, res) => {
    try {
        var sql = "SELECT * FROM tag";
        mysql.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;