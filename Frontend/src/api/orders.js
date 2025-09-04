const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/move", async (req, res, next) => {
  try {
    const { toStatus } = req.body;
    const { id } = req.params;

    await db.query("UPDATE orders SET status=?, updated_at=NOW() WHERE id=?", [
      toStatus,
      id,
    ]);

    res.json({ message: "Order moved", id, toStatus });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
