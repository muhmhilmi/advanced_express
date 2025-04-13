const db = require("../database/db");
const baseResponse = require("../utils/baseResponse.util");

const isValidUUID = (uuid) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

exports.createItem = async (req, res) => {
  try {
    const { name, price, stock, store_id } = req.body;
    const image_url = req.file?.path;

    // Cek apakah ada field yang kosong
    if (!name || !price || !stock || !store_id || !image_url) {
      return baseResponse(res, false, 400, "Missing required fields", null);
    }

    const storeResult = await db.query("SELECT id FROM stores WHERE id = $1", [store_id]);

    if (storeResult.rows.length === 0) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    const result = await db.query(
      "INSERT INTO items (name, price, stock, store_id, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, parseInt(price), parseInt(stock), store_id, image_url]
    );

    return baseResponse(res, true, 201, "Item created", result.rows[0]);
  } catch (error) {
    console.error("❌ Error saat createItem:", error);
    return baseResponse(res, false, 500, "Internal Server Error", null);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, stock, store_id } = req.body;
    const image_url = req.file?.path;

    const existingItem = await db.query(
      "SELECT * FROM items WHERE id = $1",
      [id]
    );

    if (!existingItem.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
        payload: null
      });
    }

    if (store_id) {
      const store = await db.query("SELECT * FROM stores WHERE id = $1", [store_id]);

      if (!store.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Store doesn't exist",
          payload: null
        });
      }
    }

    const updatedItem = await db.query(
      `UPDATE items SET 
        name = COALESCE($1, name),
        price = COALESCE($2, price),
        stock = COALESCE($3, stock),
        store_id = COALESCE($4, store_id),
        image_url = COALESCE($5, image_url)
      WHERE id = $6 RETURNING *`,
      [name, price, stock, store_id, image_url, id]
    );

    res.json({
      success: true,
      message: "Item updated",
      payload: updatedItem.rows[0]
    });

  } catch (err) {
    console.error("❌ Error saat updateItem:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      payload: null
    });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items", []);

    res.json({
      success: true,
      message: "Items found",
      payload: result.rows, // Hasil dari query PostgreSQL
    });
  } catch (error) {
    console.error("❌ Error saat getAllItems:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      payload: null,
    });
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;

  // Validasi format UUID
  if (!isValidUUID(id)) {
    return baseResponse(res, false, 400, "Invalid item ID format", null);
  }

  try {
    const result = await db.query("SELECT * FROM items WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    return baseResponse(res, true, 200, "Item found", result.rows[0]);
  } catch (error) {
    console.error("❌ Error saat getItemById:", error);
    return baseResponse(res, false, 500, error.message || "Internal server error", null);
  }
};  

exports.getItemsByStoreId = async (req, res) => {
  const { store_id } = req.params;

  try {
    // Cek apakah store_id ada di database
    const storeQuery = "SELECT * FROM stores WHERE id = $1";
    const storeResult = await db.query(storeQuery, [store_id]);

    if (storeResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Store doesn't exist",
        payload: null,
      });
    }

    // Ambil semua item berdasarkan store_id
    const itemsQuery = "SELECT * FROM items WHERE store_id = $1";
    const itemsResult = await db.query(itemsQuery, [store_id]);

    return res.json({
      success: true,
      message: "Items found",
      payload: itemsResult.rows,
    });
  } catch (err) {
    console.error("❌ Error saat getItemsByStoreId:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      payload: null,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah item dengan ID tersebut ada di database
    const result = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);

    // Jika tidak ada item yang terhapus, berarti ID tidak ditemukan
    if (result.rows.length === 0) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    // Jika berhasil dihapus
    return baseResponse(res, true, 200, "Item deleted", result.rows[0]);
  } catch (error) {
    console.error("Error saat deleteItem:", error);
    return baseResponse(res, false, 500, "Failed to delete item", null);
  }
};