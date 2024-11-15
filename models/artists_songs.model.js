const { Schema, model } = require('mongoose');

const artist_songSchema = Schema(
    {
        artistId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        songId: {
            type: Schema.Types.ObjectId,
            ref: 'Song',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model('Artists_Song', artist_songSchema);