const Artist = require('../models/artist.model');

const readData = (req, res) => {
    Artist.find()
        .then((data) => {
            console.log(data);
            if (data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).json([]);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

const readOne = (req, res) => {
    let id = req.params.id;

    Artist.findById(id)
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({
                    message: `Artist with id: ${id} not found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(400).json({
                    message: `Bad request, ${id} is not a valid id`
                });
            } else {
                res.status(500).json(err);
            }
        });
};

const createData = (req, res) => {
    Artist.create(req.body)
        .then((data) => {
            console.log('New Artist Created!', data);
            res.status(201).json(data);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                console.error('Validation Error!!', err);
                res.status(422).json({
                    msg: 'Validation Error',
                    error: err.message
                });
            } else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

const updateData = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Artist.findByIdAndUpdate(id, body, {
        new: false
    })
        .then((data) => {
            if (data) {
                res.status(201).json(data);
            } else {
                res.status(404).json({
                    message: `Artist with id: ${id} not found`
                });
            }
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                console.error('Validation Error!!', err);
                res.status(422).json({
                    msg: 'Validation Error',
                    error: err.message
                });
            } else if (err.name === 'CastError') {
                res.status(400).json({
                    message: `Bad request, ${id} is not a valid id`
                });
            } else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

const deleteData = (req, res) => {
    let id = req.params.id;

    Artist.deleteOne({ _id: id })
        .then((data) => {
            if (data.deletedCount) {
                res.status(200).json({
                    message: `Artist with id: ${id} deleted successfully`
                });
            } else {
                res.status(404).json({
                    message: `Artist with id: ${id} not found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(400).json({
                    message: `Bad request, ${id} is not a valid id`
                });
            } else {
                res.status(500).json(err);
            }
        });
};

module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};
