const { Schema, model } = require('mongoose');

const user_songSchema = Schema(
    {
        userId: {
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

module.exports = model('Users_Songs', user_songSchema);