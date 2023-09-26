const Note = require('../models/note');

exports.deleteNote = async (req, res) => {
    Note.deleteNote(req, res);
}

exports.notePaginate = async (req, res) => {
    Note.paginate(req, res);
}

exports.saveNote = async (req, res) => {
    Note.saveNote(req, res);
}