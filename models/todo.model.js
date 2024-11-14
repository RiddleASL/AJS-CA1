const { Schema, model } = require('mongoose');

const todoSchema = Schema(
    {
        text: {
            type: String,
            required: [true, 'text field is required'],
        },
        completed: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

module.exports = model('Todo', todoSchema);