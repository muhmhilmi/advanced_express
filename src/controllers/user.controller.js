const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

// ✅ Fungsi untuk validasi UUID
const isValidUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// ✅ Fungsi untuk validasi Email
const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// ✅ 1. REGISTER USER
exports.registerUser = async (req, res) => {
  console.log("Query Params:", req.query);
  const { name, email, password } = req.query; // 📌 Menggunakan query params

  if (!name || !email || !password) {
    return baseResponse(res, false, 400, "Missing required fields", null);
  }

  if (!isValidEmail(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  try {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, "Email already used", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.registerUser({
      name,
      email,
      password: hashedPassword,
    });

    baseResponse(res, true, 201, "User created", user);
  } catch (error) {
    console.error("❌ Error saat registerUser:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
  
};

// ✅ 2. LOGIN USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.query; // 📌 Menggunakan query params

  if (!email || !password) {
    return baseResponse(res, false, 400, "Missing email or password", null);
  }

  if (!isValidEmail(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 401, "Invalid email or password", null);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return baseResponse(res, false, 401, "Invalid email or password", null);
    }

    baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    console.error("❌ Error saat loginUser:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

// ✅ 3. GET USER BY EMAIL
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params; // 📌 Menggunakan params (http://localhost:3000/user/email@example.com)

  if (!isValidEmail(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    console.error("❌ Error saat getUserByEmail:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

// ✅ 4. UPDATE USER
exports.updateUser = async (req, res) => {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return baseResponse(res, false, 400, "Missing required fields", null);
  }

  if (!isValidUUID(id)) {
    return baseResponse(res, false, 400, "Invalid user ID format", null);
  }

  if (!isValidEmail(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await userRepository.updateUser({
      id,
      name,
      email,
      password: hashedPassword,
    });

    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    baseResponse(res, true, 200, "User updated", updatedUser);
  } catch (error) {
    console.error("❌ Error saat updateUser:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

// ✅ 5. DELETE USER
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return baseResponse(res, false, 400, "Invalid user ID format", null);
  }

  try {
    const deletedUser = await userRepository.deleteUser(id);
    if (!deletedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    baseResponse(res, true, 200, "User deleted", deletedUser);
  } catch (error) {
    console.error("❌ Error saat deleteUser:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

exports.topUpBalance = async (req, res) => {
  const { id } = req.body;
  const amount = parseInt(req.body.amount);

  if (!id || isNaN(amount) || amount <= 0) {
    return baseResponse(res, false, 400, "Invalid user ID or amount", null);
  }

  try {
    const updatedUser = await userRepository.topUpBalance(id, amount);
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    baseResponse(res, true, 200, "Balance topped up successfully", updatedUser);
  } catch (error) {
    console.error("❌ Error saat topUpBalance:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};

exports.getUserBalance = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userRepository.getUserBalance(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    baseResponse(res, true, 200, "User balance retrieved", user);
  } catch (error) {
    console.error("❌ Error saat getUserBalance:", error);
    baseResponse(res, false, 500, "Internal server error", null);
  }
};
