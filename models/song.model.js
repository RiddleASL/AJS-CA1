const { Schema, model } = require('mongoose');

const songSchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'text field is required'],
        },
        duration: {
            type: Number,
            default: false
        },
        albumId: {
            type: Schema.Types.ObjectId,
            ref: 'Album',
            required: true
        },
        artists: [{
            type: Schema.Types.ObjectId,
            ref: 'Artist',
            required: true
        }]
    },
    { timestamps: true }
);

module.exports = model('Song', songSchema);