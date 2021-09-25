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
    sql = 'SELECT `history`.`id`,\
            `history`.`transactionId`,\
            `history`.`accountId`,\
            `history`.`userId`,\
            `transactions`.`transaction`,\
            `users`.`firstname`,\
            `users`.`lastname`,\
            `date`\
            FROM `history`\
        LEFT JOIN `users`\
            ON `users`.`id` = `history`.`userId`\
        LEFT JOIN `accounts`\
            ON `accounts`.`id` = `history`.`accountId`\
        LEFT JOIN `transactions`\
            ON `transactions`.`id` = `history`.`transactionId`';
    const [list] = await connection.execute(sql);
    let count = 0;
    let transactionsList = [];
    for (let { transaction, lastname, firstname, date, accountId } of list) {
        transactionsList.push(`${++count}. Transaction "${transaction}": ${firstname} ${lastname}, account ${accountId} \non date - ${await helpers.fullDate(date)}. Successful!`);
    }
    const resp = transactionsList.join('\n');
    return resp;
}

module.exports = History;