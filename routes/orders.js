const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createOrder, getOrders, getUserOrders, getBookingsCount } = require("../controllers/ordersController");

// Create new order (auth required)
router.post("/", auth, createOrder);

// Get all orders (admin only)
router.get("/", auth, getOrders);

// Get user’s orders (auth required)
router.get("/my-orders", auth, getUserOrders);

// Get bookings count (auth required)
router.get("/bookings", auth, getBookingsCount);

// Update order status (for payment or admin control, auth required)
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, mpesaResponse } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, mpesaResponse },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Delete order (auth required)
router.delete("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;