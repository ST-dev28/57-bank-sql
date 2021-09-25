/**
 * Kaip rasyti JSDOc'sus?
 * Link: https://jsdoc.app
 */
const Validation = require('./Validations');
const History = require('./History');
const Accounts = {};

/**
* Vartotojo saskaitos sukurimas.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} userId vartotojo ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.create = async (connection, userId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }

    // tikrinam, ar vartotojas aktyvus
    const sql = 'SELECT `active`\
                 FROM `users`\
                 WHERE `id`='+ userId;
    let [rows] = await connection.execute(sql);

    if (rows[0].active !== 'TRUE') {
        return `User not found!`
    }

    const sql1 = 'INSERT INTO `accounts`\
                (`id`, `userId`,`balance`, `active`)\
                VALUES (NULL, "' + userId + '", "0", "TRUE")';
    const [rows1] = await connection.execute(sql1);

    //surandam sukurtos saskaitos ID
    const accountId = rows1.insertId;

    //irasom operacija i istorija
    await History.create(connection, 2, accountId, userId, null);

    //grazinam rezultata
    return rows1.affectedRows === 1 ? `Account created!` : `Account create failed unfortunately.`
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

    //tikrinam, ar egzistuoja toks saskaitos numeris
    let sql = 'SELECT `id`\
               FROM accounts\
               WHERE `id` = ' + accountId;
    const [rows] = await connection.execute(sql);
    if (rows.length === 0) {
        console.log(`Neteisingas saskaitos numeris!`);
        return false;
    }

    let sql1 = 'UPDATE `accounts`\
                SET `balance` = `balance` + "' + amount + '"\
                WHERE `id` = ' + accountId;
    const [rows1] = await connection.execute(sql1);

    //itraukiam i istorija pinigu inesima
    await History.create(connection, 3, accountId, null, amount);

    console.log(`Account balance has increased by value ${amount}.`);
    return true;
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
    let sql = 'SELECT `balance`\
               FROM `accounts`\
               WHERE `id` =' + accountId;

    let [rows] = await connection.execute(sql);

    // tikrinam, ar pakanka pinigu saskaitoje
    if (rows[0].balance < amount) {
        console.log(`Nepakankamas pinigu likutis saskaitoje!`);
        return false;
    }

    //Jei lesu pakanka atlieka pinigu nuskaityma
    const sql1 = 'UPDATE `accounts`\
                  SET `balance` = `balance` - "' + amount + '"\
                  WHERE `id` = ' + accountId;
    const [rows1] = await connection.execute(sql1);

    //irasom i istorijs pinigu isemino transakcija
    await History.create(connection, 4, accountId, null, amount);

    if (!!rows1.affectedRows) {
        console.log(`Account balance has decreased by value ${amount}.`);
    } else {
        console.log(`Nepavyko nurasyti pinigu!`);
    }
    return !!rows1.affectedRows;
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

    // tikrinam ar FROM saskaitoje pakankamas pinigu likutis
    let sql = 'SELECT `balance`\
               FROM `accounts`\
               WHERE `id` =' + fromAccountId;

    const [rows] = await connection.execute(sql);

    if (rows[0].balance < amount) {
        console.log(`Nepakankamas pinigu likutis saskaitoje!`);
        return false;
    }

    //tikrinam, ar egzistuoja TOKS saskaitos numeris
    let sql1 = 'SELECT `id`\
                FROM accounts\
                WHERE `id` = ' + toAccountId;
    const [rows1] = await connection.execute(sql1);
    if (rows1.length === 0) {
        console.log(`Neteisingas saskaitos numeris!`);
        return false;
    }

    // darom pinigu perlaida tarp saskaitu
    const from = 'UPDATE `accounts` SET\
                 `balance` = `balance` - "' + amount + '"\
                  WHERE `accounts`.`id` = ' + fromAccountId;
    [rows2] = await connection.execute(from);

    //irasom i istorijs pinigu isemino transakcija
    await History.create(connection, 4, fromAccountId, null, amount);

    const to = 'UPDATE `accounts` SET\
     `balance` = `balance` + "' + amount + '"\
     WHERE `accounts`.`id` = ' + toAccountId;
    [rows3] = await connection.execute(to);

    //irasom i istorijs pinigu inesimo transakcija
    await History.create(connection, 3, toAccountId, null, amount);

    return `${amount} has been transferred.`;
}

/**
* Saskaitos istrynimas.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.delete = async (connection, accountId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    //patikrinam ar aktyvus saskaitos NR
    /*if (!await Accounts.isActiveAccount(connection, accountId)) {
        return;
    }*/

    const sql = 'SELECT `balance` FROM `accounts`\
                 WHERE `id` =' + accountId;
    const [rows] = await connection.execute(sql);
    const balance = rows[0].balance;

    if (balance < 0 || balance > 0) {
        console.log(`Accout's ${accountId} balance is ${balance} and it cant be deleted.`);
    }
    else {
        const sql1 = 'UPDATE `accounts`\
                     SET `active` = "FALSE" \
                     WHERE `accounts`.`id` =' + accountId;
        const [rows] = await connection.execute(sql1);
    }

    //irasom i istorija saskaitos deaaktyvavima
    await History.create(connection, 5, accountId, null, null);

    if (!!rows.affectedRows) {
        console.log(`Account ID "${accountId}" has been freezed.`);
    } else {
        console.log(`Account delete was not succeeded!`);
    }

    return !!rows.affectedRows;
}

/**
 * Tikrinam ar saskaita egzistuoja, kai nenaudojama, pasalinima is sistemos.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes manipuliavimo metodus.
 * @param {number} accountID  Saskaitos ID.
 * @returns {Promise<string>} Tekstinis pranesimas pranesanti apie atlikta operacija, irasyma i duomenu baze.
 */
Accounts.ifAccountExist = async (connection, accountId) => {
    //patikrinam ar egzistuoja toks saskaitos NR:
    let sql = 'SELECT `id`\
                FROM `accounts`\
                WHERE `id`=' + accountId;
    let [rows] = await connection.execute(sql);

    if (rows.length === 0) {
        console.log(`Wrong account!`);
        return false;
    }
    return true;
}

/**
 * Tikrinam ar saskaita AKTYVI, kai naudojam active/notActive.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes manipuliavimo metodus.
 * @param {number} accountID  Saskaitos ID.
 * @returns {Promise<string>} Tekstinis pranesimas pranesanti apie atlikta operacija, irasyma i duomenu baze.
 */
Accounts.isActiveAccount = async (connection, accountId) => {
    const sql = 'SELECT `active`\
                 FROM `accounts`\
                 WHERE `id`='+ accountId;
    let [rows] = await connection.execute(sql);

    return rows[0].active !== 'TRUE' ? false : true;
}

module.exports = Accounts;
