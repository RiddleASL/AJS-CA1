const { Schema, model } = require('mongoose');

const artistSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'text field is required'],
        },
        genre: {
            type: String,
            required: [true, 'text field is required'],
        }
    },
    { timestamps: true }
);

module.exports = model('Artist', artistSchema);