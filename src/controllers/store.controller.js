const db = require("../database/db"); 
const baseResponse = require("../utils/baseResponse.util");

const isValidUUID = (uuid) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// ✅ Get All Stores
exports.getAllStores = async (req, res) => {
  try {
    const query = "SELECT * FROM stores";
    const result = await db.query(query);

    baseResponse(res, true, 200, "Stores found", result.rows);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Internal server error", null);
  }
};

// ✅ Create Store
exports.createStore = async (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return baseResponse(res, false, 400, "Missing store name or address", null);
  }

  try {
    const query = "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *";
    const values = [name, address];
    const result = await db.query(query, values);

    baseResponse(res, true, 201, "Store created", result.rows[0]);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Internal server error", null);
  }
};

// ✅ Get Store by ID
exports.getStoreById = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return baseResponse(res, false, 400, "Invalid store ID format", null);
  }

  try {
    const query = "SELECT * FROM stores WHERE id = $1";
    const result = await db.query(query, [id]);

    if (result.rowCount === 0) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    baseResponse(res, true, 200, "Store found", result.rows[0]);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Internal server error", null);
  }
};

// ✅ Update Store
exports.updateStore = async (req, res) => {
  const { id, name, address } = req.body;

  if (!id || !name || !address) {
    return baseResponse(res, false, 400, "All fields are required (id, name, address)", null);
  }

  if (!isValidUUID(id)) {
    return baseResponse(res, false, 400, "Invalid store ID format", null);
  }

  try {
    const query = "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *";
    const values = [name, address, id];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    baseResponse(res, true, 200, "Store updated", result.rows[0]);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Internal server error", null);
  }
};

// ✅ Delete Store
exports.deleteStore = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return baseResponse(res, false, 400, "Invalid store ID format", null);
  }

  try {
    const query = "DELETE FROM stores WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);

    if (result.rowCount === 0) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    baseResponse(res, true, 200, "Store deleted", result.rows[0]);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Internal server error", null);
  }
};
