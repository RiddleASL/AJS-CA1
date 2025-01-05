const User = require('../models/user.model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateEmail = (email) =>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const register = (req, res) => {
    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    console.log(newUser);

    //validate user input
    if (!newUser.email || !newUser.username || !newUser.password) {
        return res.status(400).json({
            msg: 'You need to send email, username and password'
        });
    } else if (newUser.password.length < 6) {
        return res.status(400).json({
            msg: 'Password should be at least 6 characters long'
        });
    } else if (!validateEmail(newUser.email)) {
        return res.status(400).json({
            msg: 'Invalid email address'
        });
    }

    newUser.save((err, user) => {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        } else {
            user.password = undefined;
            return res.status(201).json(user);
        }
    });
};

const login = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then((user) => {
            if (!user || !user.compareName(req.body.username) || !user.comparePassword(req.body.password)) {
                res.status(401).json({
                    msg: 'Authentication failed. Invalid user or password'
                });
                console.log(req.body.username);
                
            } else {
                let token = jwt.sign(
                    {
                        email: user.email,
                        name: user.name,
                        _id: user._id
                    },
                    process.env.APP_KEY
                );

                res.status(200).json({
                    msg: 'All good',
                    token
                });
            }
        })
        .catch((err) => {
            throw err;
        });
};

const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({
            msg: 'Unauthorised user!!'
        });
    }
};

module.exports = {
    register,
    login,
    loginRequired
};
