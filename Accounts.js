/**
 * Kaip rasyti JSDOc'sus?
 * Link: https://jsdoc.app
 */
const Validation = require('./Validations');
const Accounts = {};

/**
* Vartotojo saskaitos sukurimas.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} userId vartotojo ID.
* @param {number} balance saskaitos balansas.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.create = async (connection, userId, balance) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(balance)) {
        return `* Parametras turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'INSERT INTO `accounts`\
            (`id`, `userId`,`balance`)\
                VALUES (NULL, "' + userId + '", "' + balance + '")';
    [rows] = await connection.execute(sql);
    return `Account created!`
}

/**
* Pinigu inesimas i saskaita.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @param {number} amount inesama suma.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.addAmountById = async (connection, accountId, amount) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(amount)) {
        return `** Parametras turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'UPDATE `accounts` SET `balance` = `balance` + "' + amount + '" WHERE `accounts`.`id` = ' + accountId;
    [rows] = await connection.execute(sql);
    return `Account balance has increased by value ${amount}.`;
}

/**
* Pinigu isemimas is saskaitos.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @param {number} amount nurasoma suma.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.reduceAmountById = async (connection, accountId, amount) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(amount)) {
        return `*** Parametras turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'UPDATE `accounts` SET `balance` = `balance` - "' + amount + '" WHERE `accounts`.`id` = ' + accountId;
    [rows] = await connection.execute(sql);
    return `Account balance has decreased by value ${amount}.`;
}

/**
* Pinigu pervedimas is vienos saskaitos i kita.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} fromAccountId is saskaitos ID.
* @param {number} toAccountId i saskaitos ID.
* @param {number} amount inesama suma.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.transfer = async (connection, fromAccountId, toAccountId, amount) => {
    //VALIDATIONS
    if (!Validation.IDisValid(fromAccountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.IDisValid(toAccountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(amount)) {
        return `**** Parametras turi buti teigiamas sveikasis skaicius!`;
    }

    const from = 'UPDATE `accounts` SET\
     `balance` = `balance` - "' + amount + '"\
     WHERE `accounts`.`id` = ' + fromAccountId;
    [rows1] = await connection.execute(from);

    const to = 'UPDATE `accounts` SET\
     `balance` = `balance` + "' + amount + '"\
     WHERE `accounts`.`id` = ' + toAccountId;
    [rows2] = await connection.execute(to);

    return `${amount} has been transferred.`;
}

/**
* Saskaitos is trynimas.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.delete = async (connection, accountId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'SELECT `balance` FROM `accounts`\
                 WHERE `accounts`.`id` =' + accountId;
    const [rows] = await connection.execute(sql);
    const balance = rows[0].balance;

    if (balance > 0 || balance < 0) {
        return `Accous's ${accountId} balance is ${balance} and it cant be deleted.`;
    }
    else {
        const sql1 = 'DELETE FROM `accounts`\
                     WHERE `accounts`.`id` =' + accountId;
        const [rows1] = await connection.execute(sql1);
    }
    return `Account ID "${accountId}" has been removed.`;
}
module.exports = Accounts;
