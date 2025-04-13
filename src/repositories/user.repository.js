const db = require("../database/db");
const { v4: uuidv4 } = require("uuid"); // 📌 UUID untuk ID unik

// ✅ REGISTER USER
exports.registerUser = async ({ name, email, password }) => {
  const res = await db.query(
    `INSERT INTO users (id, name, email, password) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, created_at`, // 📌 Jangan kembalikan password!
    [uuidv4(), name, email, password]
  );
  return res.rows[0]; 
};

// ✅ FIND USER BY EMAIL
exports.findUserByEmail = async (email) => {
  const res = await db.query(
    `SELECT id, name, email, password FROM users WHERE email = $1`, // 📌 Password tetap diambil untuk login
    [email]
  );
  return res.rows[0]; 
};

// ✅ UPDATE USER
exports.updateUser = async ({ id, name, email, password }) => {
  const res = await db.query(
    `UPDATE users 
     SET name = $1, email = $2, password = $3, updated_at = NOW()
     WHERE id = $4 
     RETURNING *`,
    [name, email, password, id]
  );
  return res.rows[0];
};

// ✅ DELETE USER
exports.deleteUser = async (id) => {
  const res = await db.query(
    `DELETE FROM users WHERE id = $1 RETURNING id, name, email`, // 📌 Kembalikan info user yang dihapus
    [id]
  );
  return res.rows[0]; 
};

exports.topUpBalance = async (id, amount) => {
  const res = await db.query(
    `UPDATE users 
     SET balance = balance + $1 
     WHERE id = $2 
     RETURNING id, name, email, balance, updated_at;`,
    [amount, id]
  );
  return res.rows[0];
};

exports.getUserBalance = async (id) => {
  const res = await db.query(
    `SELECT id, name, email, balance FROM users WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

