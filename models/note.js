const TABLE = "note";
const mysql = require('../db_connection');
const User = require('./user');

function getNotes() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

function paginate(req, res) {
    try {
        var perPage = 15;
        var nexPage = (req.params.page - 1) * perPage;
        var sql = "SELECT * FROM note as n LEFT JOIN user_note as un ON n.id = un.note_id " +
            "WHERE un.user_id = (SELECT u.id FROM user as u WHERE u.token=?)" +
            " ORDER BY n.updated_at DESC LIMIT ?,?"

        mysql.query(sql, [req.header('x_authorization'), nexPage, perPage], function (err, result) {
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
}

function saveNote(req, res) {
    try {
        User.getUserId(req.header('x_authorization')).then((userId) => {
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
                        const dataNoteTag = req.body.tags.map((ob) => {
                            return [result.insertId, ob]
                        });
                        mysql.query(insertNoteTagSql, [dataNoteTag], function (err, result) {
                            if (err) throw err;
                        })
                    }

                    const dataUserNote = [
                        [userId, result.insertId]
                    ];

                    mysql.query(insertUserNoteSql, [dataUserNote], function (err, result) {
                        if (err) throw err;
                    })
                });
            }
        });
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
}

function deleteNote(req, res) {
    try {
        var sql = "DELETE FROM note as n WHERE n.id=? ";
        mysql.query(sql, [req.params.id], function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.send(error.message);
    }
}

function updateNote() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getNotes,
    paginate,
    saveNote,
    deleteNote,
    updateNote
}