const db = require("../database/db");

// 🔹 1. Buat Transaksi
exports.createTransaction = async ({ user_id, item_id, quantity, total }) => {
  const res = await db.query(
    `INSERT INTO transactions (user_id, item_id, quantity, total) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *;`,
    [user_id, item_id, quantity, total]
  );
  return res.rows[0];
};

// 🔹 2. Bayar Transaksi
exports.payTransaction = async ({ transaction_id }) => {
  const res = await db.query(
    `UPDATE transactions 
     SET status = 'paid'
     WHERE id = $1 
     RETURNING *;`,
    [transaction_id]
  );
  return res.rows[0];
};

// 🔹 3. Hapus Transaksi
exports.deleteTransaction = async (transaction_id) => {
  const res = await db.query(
    `DELETE FROM transactions 
     WHERE id = $1 
     RETURNING *;`,
    [transaction_id]
  );
  return res.rows[0];
};
