require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5175" }));
app.use(express.json());

// Routes
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ Backend server running at http://localhost:${port}`);
});
