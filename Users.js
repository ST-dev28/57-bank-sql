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
    //VALIDATIONS
    if (!Validation.isText(userFirstname)) {
        return `Parametras turi buti ne tuscias tekstas!`;
    }
    if (!Validation.isText(userLastname)) {
        return `Parametras turi buti ne tuscias tekstas!`;
    }

    const sql = 'INSERT INTO `users`\
            (`id`, `firstname`, `lastname`)\
                VALUES (NULL, "' + userFirstname + '", "' + userLastname + '")';
    const [rows] = await connection.execute(sql);
    //console.log(rows);
    const holderId = rows.insertId;   // randam userId
    const account = await Accounts.create(connection, holderId, 0);  // userId perduodamas i accounts lentele
    const resp = account;
    return resp;
}

/**
 * Autoriaus paieska pagal id ir viena papildoma parametra. 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} userId vartotojo ID.
 * @param {string} userLastname vartotojo pavarde.
 * @returns { Promise < string >} Tekstas, skelbiantis kokia savybe, pagal duota ID, buvo atnaujinta i kokia verte.
 */
Users.updateSurnameById = async (connection, userId, userLastname) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isText(userLastname)) {
        return `Parametras turi buti ne tuscias tekstas!`;
    }

    const sql = 'UPDATE users SET lastname = "' + userLastname + '" WHERE users.id =' + userId;
    [rows] = await connection.execute(sql);
    const updatedSurnameById = `User with ID ${userId} has a new surname now as "${userLastname}."`
    return updatedSurnameById;
}

/**
 * Autoriaus paieska pagal id ir viena papildoma parametra. 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} userId vartotojo ID.
 * @returns { Promise < string >} Tekstas, skelbiantis kokia savybe, pagal duota ID, buvo atnaujinta i kokia verte.
 */
Users.delete = async (connection, userId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'SELECT `firstname`, `lastname`,\
                        `accounts`.`balance`, `accounts`.`id` as accountId\
                FROM `users`\
                LEFT JOIN `accounts`\
                    ON `accounts`.`userId` = `users`.`id`\
                WHERE `users`.`id` =' + userId;
    [rows] = await connection.execute(sql);

    // tikrinam ar bent vienoje vartotojo saskaitoje yra pinigu
    if (rows.some(row => row.balance > 0)) {
        return `User ID ${userId} cant be deleted cause the balance is not 0.`
    }

    // jei saskaitos be likucio, tada trinam
    for (let i = 0; i < rows.length; i++) {
        let account = rows[i];
        const status = await Accounts.delete(connection, account.accountId);
    }
    return `User ID ${userId} has been removed.`;
}


module.exports = Users;