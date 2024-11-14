require('dotenv').config();
const { connect, disconnect } = require('../utils/db');
const Todo = require('../models/todo.model');
const User = require('../models/user.model');

const users = [
    {
        name: 'Mo Che',
        email: 'mo@testing.com',
        password: 'secret'
    }
];

const todos = [
    {
        text: 'Clean my office',
        completed: true
    },
    {
        text: 'Buy new keyboard',
        completed: true
    },
    {
        text: 'Finish CA1 in Testing101',
        completed: false
    },
    {
        text: 'Fix the problem with the thing',
        completed: false
    },
    {
        text: 'Clean the car',
        completed: false
    }
];

let seedDB = async () => {
    await connect();
    await User.deleteMany();
    await Todo.deleteMany();

    await User.insertMany(users);
    await Todo.insertMany(todos);
};

seedDB().then(() => {
    console.log('Operation successfull!');
    disconnect();
});
