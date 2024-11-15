const { Schema, model } = require('mongoose');

const albumSchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'text field is required'],
        },
        releaseDate: {
            type: Date,
            default: false
        },
        artists: [{
            type: Schema.Types.ObjectId,
            ref: 'Artist',
            required: true
        }]
    },
    { timestamps: true }
);

module.exports = model('Album', albumSchema);