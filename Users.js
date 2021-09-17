const Validation = require('./Validations');
const Accounts = require('./Accounts');
const Users = {};

/**
* Vartotojo itrukimas i duombaze.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {string} userFirstname  vartotojo vardas.
* @param {string} userLastname  vartotojo pavarde.
* @param {number} userId vartotojo ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Users.create = async (connection, userFirstname, userLastname) => {
    const sql = 'INSERT INTO `users`\
            (`id`, `firstname`, `lastname`)\
                VALUES (NULL, "' + userFirstname + '", "' + userLastname + '")';
    const [rows] = await connection.execute(sql);
    console.log(rows);
    const ownerId = rows.insertId;   // randam userId
    //await Accounts.create(connection, balance = 0, ownerId);  // userId perduodanas is accounts lentele

    const resp = `${await Accounts.create(connection, ownerId, balance = 0)}`;
    return resp;
}

module.exports = Users;

