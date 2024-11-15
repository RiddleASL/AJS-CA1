const { Schema, model } = require('mongoose');

const artist_albumSchema = Schema(
    {
        artistId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        albumId: {
            type: Schema.Types.ObjectId,
            ref: 'Album',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model('Artists_Albums', artist_albumSchema);