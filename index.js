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

    const user1 = await Users.create(conn, 'Ona', 'Onaityte');
    console.log(user1);
    const user2 = await Users.create(conn, 'Antanas', 'Antanaitis');
    console.log(user2);
    const user3 = await Users.create(conn, 'Jonas', 'Jonaitis');
    console.log(user3);
    const user4 = await Users.create(conn, 'Maryte', 'Marytaite');
    console.log(user4);

    console.log('');
    const account1 = await Accounts.create(conn, 1, 100);
    console.log(account1);
    const account2 = await Accounts.create(conn, 2, 20);
    console.log(account2);
    const account3 = await Accounts.create(conn, 3, 30);
    console.log(account3);
    const account4 = await Accounts.create(conn, 4, 40);
    console.log(account4);

}

app.init();

module.exports = app;