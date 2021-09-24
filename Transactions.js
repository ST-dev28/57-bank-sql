const Transactions = {}

Transactions.create = async (connection, transactionType) => {
    const sql = 'INSERT INTO `transactions` (\
                    `id`, `transaction`) \
                VALUES (NULL, "' + transactionType + '")';
    const [rows] = await connection.execute(sql);
}
module.exports = Transactions;