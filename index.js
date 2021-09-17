const db = require('./db');
const Users = require('./Users');
const Accounts = require('./Accounts');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const conn = await db.init({
        host: 'localhost',
        user: 'root',
        database: 'bank',
    });

    // LOGIC BELOW

}

app.init();

module.exports = app;