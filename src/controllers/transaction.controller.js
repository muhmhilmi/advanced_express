const transactionRepository = require("../repositories/transaction.repository");
const baseResponse = require("../utils/baseResponse.util");

// 🔹 1. Buat Transaksi
exports.createTransaction = async (req, res) => {
  const { user_id, item_id, quantity, total } = req.body;

  if (!user_id || !item_id || !quantity || !total) {
    return baseResponse(res, false, 400, "Missing required fields", null);
  }

  try {
    const transaction = await transactionRepository.createTransaction({ user_id, item_id, quantity, total });

    baseResponse(res, true, 201, "Transaction created", transaction);
  } catch (error) {
    console.error("❌ Error saat createTransaction:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

// 🔹 2. Bayar Transaksi
exports.payTransaction = async (req, res) => {
  const { transaction_id } = req.body;

  if (!transaction_id) {
    return baseResponse(res, false, 400, "Missing transaction ID", null);
  }

  try {
    const transaction = await transactionRepository.payTransaction({ transaction_id });

    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    baseResponse(res, true, 200, "Transaction paid successfully", transaction);
  } catch (error) {
    console.error("❌ Error saat payTransaction:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

// 🔹 3. Hapus Transaksi
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return baseResponse(res, false, 400, "Missing transaction ID", null);
  }

  try {
    const deletedTransaction = await transactionRepository.deleteTransaction(id);

    if (!deletedTransaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
  } catch (error) {
    console.error("❌ Error saat deleteTransaction:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};
