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
    return `Transaction history has been created!`
}

History.allTransactions = async (connection) => {
    sql = 'SELECT `history`.`transactionId`,\
            `history`.`accountId`,\
            `transactions`.`transaction`,\
            `users`.`firstname`,\
            `users`.`lastname`,\
            `date`\
            FROM `users`\
        LEFT JOIN `accounts`\
            ON `users`.`id` = `accounts`.`userId`\
        LEFT JOIN `history`\
            ON `accounts`.`id` = `history`.`accountId`\
        LEFT JOIN `transactions`\
            ON `transactions`.`id` = `history`.`transactionId`';
    const [list] = await connection.execute(sql);
    //console.log(list);
    let count = 0;
    let transactionsList = [];
    for (let { transaction, lastname, firstname, date, accountId } of list) {
        transactionsList.push(`${++count}. Transaction - "${transaction}", user - ${firstname} ${lastname}, account number - ${accountId} \ntransaction date - ${await helpers.fullDate(date)}. Successful!`);
    }
    const resp = transactionsList.join('\n');
    return await resp;
}

module.exports = History;