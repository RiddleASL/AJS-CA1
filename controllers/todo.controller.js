const Todo = require('../models/todo.model');

const toggleDone = (req, res) => {
    let id = req.params.id;

    Todo.findById(id)
        .then((todo) => {
            if (todo) {
                todo.completed = !todo.completed;
                return todo.save();
            } else {
                res.status(404).json({
                    message: `Todo with id: ${id} not found`
                });
            }
        })
        .then((data) => {
            res.status(200).json(data);
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

const readData = (req, res) => {
    Todo.find()
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

    Todo.findById(id)
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({
                    message: `Todo with id: ${id} not found`
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
    Todo.create(req.body)
        .then((data) => {
            console.log('New Todo Created!', data);
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

    Todo.findByIdAndUpdate(id, body, {
        new: false
    })
        .then((data) => {
            if (data) {
                res.status(201).json(data);
            } else {
                res.status(404).json({
                    message: `Todo with id: ${id} not found`
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

    Todo.deleteOne({ _id: id })
        .then((data) => {
            if (data.deletedCount) {
                res.status(200).json({
                    message: `Todo with id: ${id} deleted successfully`
                });
            } else {
                res.status(404).json({
                    message: `Todo with id: ${id} not found`
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
    deleteData,
    toggleDone
};
