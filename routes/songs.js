const express = require('express');
const router = express.Router();
const { loginRequired } = require('../controllers/user.controller');

const {
    readData,
    readOne,
    createData,
    updateData,
    deleteData,
    addSong,
    removeSong
} = require('../controllers/song.controller');

router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', loginRequired, createData)
    .put('/:id', loginRequired, updateData)
    .delete('/:id', loginRequired, deleteData)
    .post('/:id/add', loginRequired, addSong)
    .delete('/:id/remove', loginRequired, removeSong);

module.exports = router;
