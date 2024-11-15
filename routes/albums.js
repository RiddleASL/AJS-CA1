const express = require('express');
const router = express.Router();
const { loginRequired } = require('../controllers/user.controller');

const {
    readData,
    readOne,
    createData,
    updateData,
    deleteData,
    addAlbum,
    removeAlbum
} = require('../controllers/album.controller');

router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', loginRequired, createData)
    .put('/:id', loginRequired, updateData)
    .delete('/:id', loginRequired, deleteData)
    .post('/:id/add', loginRequired, addAlbum)
    .delete('/:id/remove', loginRequired, removeAlbum);

module.exports = router;
