const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

require('dotenv').config();

if(process.env.ENVIRONMENT !== 'testing'){
    console.log(process.env.ENVIRONMENT);
    require('./utils/db').connect();
}

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.headers?.authorization?.split(' ')[0] === 'Bearer') {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.APP_KEY,
            (err, decoded) => {
                if (err) req.user = undefined;

                req.user = decoded;
                next();
            }
        );
    } else {
        req.user = undefined;
        next();
    }
});

app.use('/api/songs', require('./routes/songs'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/users', require('./routes/users'));

module.exports = app;