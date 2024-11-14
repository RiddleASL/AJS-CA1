const mongoose = require('mongoose');
let db;

const connect = async () => {
    db = null;

    try {
        mongoose.set('strictQuery', false);
    
        let dbURL = process.env.DB_ATLAS_URL;

        if(process.env.ENVIRONMENT === 'testing'){
            dbURL = process.env.TEST_DB_ATLAS_URL;
        }

        await mongoose.connect(dbURL);

        console.log('Connected successfully to db');
        db = mongoose.connection;
    } catch (error) {
        console.log(error);
    } finally {
        if (db !== null && db.readyState === 1) {
            // await db.close();
            // console.log("Disconnected successfully from db");
        }
    }
};

const disconnect = async () => {
    await db.close();
};

module.exports = { connect, disconnect };
