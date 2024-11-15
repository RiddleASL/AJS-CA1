require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect, disconnect } = require('../utils/db');

const Artist = require('../models/artist.model');
const User = require('../models/user.model');

const usersBase = [
    {
        username: 'aaron',
        email: 'aaron@testing.com',
        password: 'password',
    }
];

const users = usersBase.map((user) => {
    user.password = bcrypt.hashSync(user.password, 10);
    return user;
});

const artists = [
    {
        name: 'Kendrick Lamar',
        genre: 'Hip Hop',
    },
    {
        name: 'Beyonce',
        genre: 'Pop',
    },
    {
        name: 'Ed Sheeran',
        genre: 'Ginger',
    },
];

let seedDB = async () => {
    await connect();
    await User.deleteMany();
    await Artist.deleteMany();

    await User.insertMany(users);
    await Artist.insertMany(artists);
};

seedDB().then(() => {
    console.log('Operation successfull!');
    
    disconnect();
});
