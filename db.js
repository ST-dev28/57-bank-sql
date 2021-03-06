const mysql = require('mysql2/promise');

const db = {}

db.init = async ({ database, host, user }) => {
    const connection = await db.createDatabase({ database, host, user });

    await db.createTableUsers(connection);
    await db.createTableAccounts(connection);
    await db.createTableHistory(connection);
    await db.createTableTransactions(connection);

    return connection;
}

db.createDatabase = async ({ database, host, user }) => {
    host = host ? host : 'localhost';
    user = user ? user : 'root';

    try {
        let db = await mysql.createConnection({ host, user });
        await db.execute(`DROP DATABASE IF EXISTS \`${database}\``);
        console.log('Buvusi duombaze istrinta');
    } catch (error) {
        console.log('Nera duombazes, kuria butu galima istrinti');
    }

    try {
        let db = await mysql.createConnection({ host, user });
        await db.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await db.end();

        db = await mysql.createConnection({ host, user, database });
        console.log('Nauja duombaze sukurta');
        return db;
    } catch (error) {
        return error;
    }
}

db.createTableUsers = async (connection) => {
    try {
        const sql = 'CREATE TABLE IF NOT EXISTS `users` (\
                        `id` int(10) NOT NULL AUTO_INCREMENT,\
                        `firstname` char(20) COLLATE utf8_swedish_ci NOT NULL,\
                        `lastname` char(20) COLLATE utf8_swedish_ci NOT NULL,\
                        `active` char(5) COLLATE utf8_swedish_ci NOT NULL,\
                        PRIMARY KEY(`id`)\
                    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
        await connection.execute(sql);
    } catch (error) {
        console.log('Nepavyko sukurti naudotoju lenteles');
        console.log(error);
        return error;
    }
}

db.createTableAccounts = async (connection) => {
    try {
        const sql = 'CREATE TABLE IF NOT EXISTS `accounts` (\
                        `id` int(10) NOT NULL AUTO_INCREMENT,\
                        PRIMARY KEY(`id`),\
                        `userId` INT(10) NOT NULL,\
                        `balance` DECIMAL(12,2) NOT NULL,\
                        `active` char(5) COLLATE utf8_swedish_ci NOT NULL,\
                        `transaction_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP\
                    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
        await connection.execute(sql);
        // apsauga nuo istrynimo
        const sql1 = 'ALTER TABLE `accounts`\
                     ADD FOREIGN KEY (`userId`)\
                         REFERENCES `users`(`id`)\
                            ON DELETE RESTRICT\
                            ON UPDATE RESTRICT;'
        await connection.execute(sql1);

    } catch (error) {
        console.log('Nepavyko sukurti saskaitu lenteles');
        console.log(error);
        return error;
    }
}

db.createTableTransactions = async (connection) => {
    try {
        const sql = 'CREATE TABLE `bank`.`transactions` (\
                         `id` INT(10) NOT NULL AUTO_INCREMENT ,\
                           `transaction` VARCHAR(20) NOT NULL ,\
                    PRIMARY KEY  (`id`)) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci;';
        await connection.execute(sql);

        const sql1 = 'INSERT INTO `transactions`\
                            (`id`, `transaction`)\
                    VALUES (NULL, "create_user"),\
                            (NULL, "create_account"),\
                            (NULL, "income"),\
                            (NULL, "outcome"),\
                            (NULL, "freezed_account"),\
                            (NULL, "freezed_user")';
        await connection.execute(sql1)
    } catch (error) {
        console.log('Nepavyko sukurti tranzakciju lenteles');
        console.log(error);
        return error;
    }
}

db.createTableHistory = async (connection) => {
    try {
        const sql = 'CREATE TABLE IF NOT EXISTS `history` (\
                        `id` int(10) NOT NULL AUTO_INCREMENT,\
                        PRIMARY KEY(`id`),\
                        `transactionId` INT(2) NULL,\
                        `accountId` INT(10) NOT NULL,\
                        `userId` INT(10) NOT NULL,\
                        `amount` DECIMAL(12,2) NOT NULL,\
                        `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP\
                    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
        await connection.execute(sql);
    } catch (error) {
        console.log('Nepavyko sukurti istorijos lenteles');
        console.log(error);
        return error;
    }
}

module.exports = db;
