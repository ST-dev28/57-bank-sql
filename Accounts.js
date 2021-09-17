/**
 * Kaip rasyti JSDOc'sus?
 * Link: https://jsdoc.app
 */
const Validation = require('./Validations');
const Accounts = {};

/**
* Vartotojo itrukimas i duombaze.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} userId vartotojo ID.
* @param {number} balance saskaitos balansas.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.create = async (connection, userId, balance) => {
    const sql = 'INSERT INTO `accounts`\
            (`id`, `userId`,`balance`)\
                VALUES (NULL, "' + userId + '", "' + balance + '")';
    const [rows] = await connection.execute(sql);
    //console.log(rows);
    return `Saskaita sukurta!`
}

module.exports = Accounts;
