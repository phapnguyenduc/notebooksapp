const express = require('express');
const mysql = require('../db_connection');

const router = express.Router();

router.post("/note/save", async (req, res) => {
    try {
        if (req.body.content !== undefined) {
            var sql = "INSERT INTO note (content) VALUES ? ON DUPLICATE KEY UPDATE content=?";
            var values = [
                [req.body.content]
            ];
            mysql.query(sql, [values, req.body.content], function (err, result) {
                if (err) throw err;
                res.send("Number of records inserted: " + result.affectedRows);

                if (req.body.tags.length !== 0) {
                    // Insert to note_tag table
                    const dataInsert = req.body.tags.map((ob) => {
                        return [result.insertId, ob]
                    });
                    mysql.query("INSERT INTO note_tag (note_id, tag_id) VALUES ?", [dataInsert], function (err, result) {
                        if (err) throw err;
                    })
                }
            });
        }
    } catch (error) {
        res.send(error.message);
    }
});

router.get("/notes", async (req, res) => {
    try {
        var sql = "SELECT n.id, t.id as tag_id, n.content, n.created_at, t.name as tag_name  FROM note as n " +
            "LEFT JOIN note_tag as nt ON n.id = nt.note_id " +
            "LEFT JOIN tag as t ON nt.tag_id = t.id " +
            "ORDER BY n.created_at DESC";

        mysql.query(sql, function (err, result) {
            if (err) throw err;

            var dataMerge = [];
            result = result.filter(function (entry) {
                if (entry.tag_name !== null && entry.tag_id !== null) {
                    var previous;

                    if (dataMerge.hasOwnProperty(entry.id)) {
                        previous = dataMerge[entry.id];
                        if (entry.tags === null) {
                            previous.tags = [];
                        } else {
                            previous.tags.push({ tag_name: "#" + entry.tag_name, tag_id: entry.tag_id });
                        }

                        return false;
                    }

                    if (!Array.isArray(entry.tags)) {
                        if (entry.tags === null) {
                            entry.tags = [];
                        } else {
                            entry.tags = [{ tag_name: "#" + entry.tag_name, tag_id: entry.tag_id }];
                        }
                    }
                    dataMerge[entry.id] = entry;
                }
                return true;
            });
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

router.delete("/note/delete/:id", async (req, res) => {
    try {
        var sql = "DELETE FROM note as n WHERE n.id = ";
        mysql.query(sql + req.params.id, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;