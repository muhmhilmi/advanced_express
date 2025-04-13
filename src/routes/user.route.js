const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:email", userController.getUserByEmail);
router.put("/", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/topUp", userController.topUpBalance);
router.get("/balance/:id", userController.getUserBalance);

module.exports = router;
