const express = require("express");
const cors = require("cors"); // Import cors
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const itemRoutes = require("./src/routes/item.route");
const userRoutes = require("./src/routes/user.route");
const storeRoutes = require("./src/routes/store.route");
const transactionRoutes = require("./src/routes/transaction.route");

app.use("/item", itemRoutes);
app.use("/user", userRoutes);
app.use("/store", storeRoutes);
app.use("/transaction", transactionRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

