const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('../db_connection');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

dotenv.config();

router.post("/note/save/", async (req, res) => {
    try {
        // Create new note
        if (!req.body.content === false && !Number.isInteger(req.body.id)) {
            var sql = "INSERT INTO note (content) VALUES ?";
            var values = [
                [req.body.content]
            ];
            mysql.query(sql, [values], function (err, result) {
                if (err) throw err;

                var insertNoteTagSql = "INSERT INTO note_tag (note_id, tag_id) VALUES ?";
                var insertUserNoteSql = "INSERT INTO user_note (user_id, note_id) VALUES ?";

                if (req.body.tags.length !== 0) {
                    // Insert data for note_tag table
                    const dataInsert = req.body.tags.map((ob) => {
                        return [result.insertId, ob]
                    });
                    mysql.query(insertNoteTagSql, [dataInsert], function (err, result) {
                        if (err) throw err;
                    })
                }
                console.log(req.header('auth-token'));
                mysql.query(insertUserNoteSql, [[req.header('auth-token').id, result.insertId]], function (err, result) {
                    if (err) throw err;
                })
            });
        }
        if (Number.isInteger(req.body.id)) {
            // Update note
            var sql = 'UPDATE note SET content=? WHERE id=?; ' +
                'SELECT tag_id FROM note_tag WHERE note_id=?';
            mysql.query(sql, [req.body.content, req.body.id, req.body.id], function (err, results) {
                if (err) throw err;

                if (req.body.tags.length !== 0) {
                    var tagAdded = results[1].map((tag) => { return tag.tag_id });
                    var tagReq = req.body.tags;
                    var updateTag = {
                        sql: '',
                        tags: []
                    };
                    if (tagReq.length > tagAdded.length) {
                        //update, add more tag
                        var tags = tagReq.filter(o => { return !tagAdded.includes(o) });
                        updateTag.sql = 'INSERT INTO note_tag (note_id, tag_id) VALUES ?';
                        updateTag.tags = tags.map((ob) => {
                            return [req.body.id, ob]
                        });

                    } else {
                        //update, remove tag
                        var tags = tagAdded.filter(o => { return !tagReq.includes(o) });
                        updateTag.sql = 'DELETE FROM note_tag WHERE (note_id, tag_id) IN (?)';
                        updateTag.tags = tags.map((ob) => {
                            return [req.body.id, ob]
                        });
                    }
                    mysql.query(updateTag.sql, [updateTag.tags], function (err, result) {
                        if (err) throw err;
                    })
                }
            });
        }
        res.send("Save notes successfully");
    } catch (error) {
        res.send(error.message);
    }
});

router.get("/notes/:page", async (req, res) => {
    try {
        var perPage = 15;
        var nexPage = (req.params.page - 1) * perPage;
        var sql = "SELECT * FROM note as n ORDER BY n.updated_at DESC LIMIT ?,?"

        mysql.query(sql, [nexPage, perPage], function (err, result) {
            if (err) throw err;

            var sqlNoteTag = "SELECT nt.note_id as id, nt.tag_id, t.name as tag_name FROM note_tag as nt LEFT JOIN " +
                "tag as t on nt.tag_id = t.id";

            mysql.query(sqlNoteTag, function (err, noteTagResult) {
                var dataMerge = [];
                // Convert tags to array of tag
                noteTagResult = noteTagResult.filter(function (entry) {
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
                result = result.map((object) => {
                    return {
                        ...object, tags: noteTagResult.filter(o => o.id === object.id).map(tag => tag.tags)[0]
                    }
                });
                res.send(result);
            });
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

router.delete("/note/delete/:id", verifyToken, async (req, res) => {
    try {
        var sql = "DELETE FROM note as n WHERE n.id=? ";
        mysql.query(sql, [req.params.id], function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/user/add", async (req, res) => {
    try {
        var sql = "INSERT INTO user (token) VALUES ?";
        const token = jwt.sign({ user_name: req.body.username }, process.env.TOKEN_SECRET, {});
        var values = [
            [token]
        ];
        mysql.query(sql, [values], function (err, result) {
            if (err) throw err;

            res.send({ id: result.insertId, token: token });
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;