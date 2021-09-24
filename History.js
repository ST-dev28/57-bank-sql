const helpers = require('./helpers');
const History = {}

/**
 * Tranzakciju irasymas i duombaze.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes manipuliavimo metodus.
 * @param {number} transactionId Atliktos operacijos pavadinimas, jei neduodam irasom null.
 * @param {number} accountId Saskaitos ID, jei neduodam irasom null.
 * @param {number} userId Vartotojo ID, jei neduodam irasom null.
 * @param {number} amount Pinigu suma atliekant operaciaj,jei neduodam irasom null.
 * @returns {Promise<string>} Tekstinis pranesimas pranesanti apie atlikta operacija, irasyma i duomenu baze.
 */
History.create = async (connection, transactionId, accountId, userId, amount) => {
    sql = 'INSERT INTO `history`\
     (`id`, `transactionId`, \
        `accountId`, \
        `userId`, \
        `amount`, \
        `date`\
        ) VALUES \
        (NULL, "'+ transactionId + '", "' + accountId + '", "' + userId + '", "' + amount + '", current_timestamp())';
    await connection.execute(sql);
    return `Transactions has been created!`
}

module.exports = History;