const { Schema, model } = require('mongoose');

const user_albumSchema = Schema(
    {
        userId: {
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

module.exports = model('Users_Albums', user_albumSchema);