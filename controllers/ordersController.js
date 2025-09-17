const Order = require("../models/Order");

// CREATE order (customer)
exports.createOrder = async (req, res) => {
  try {
    const { items, amount, phone } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }
    if (!phone || !amount) {
      return res.status(400).json({ message: "Phone and amount are required" });
    }

    const order = new Order({
      items,
      amount,
      phone,
      createdBy: req.user.id,
      status: "pending",
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// GET all orders (admin)
exports.getOrders = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    const orders = await Order.find().populate("createdBy", "name email");
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// GET user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ createdBy: req.user.id }).populate("createdBy", "name email");
    res.json(orders);
  } catch (err) {
    console.error("Get User Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// GET bookings count (customer)
exports.getBookingsCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ createdBy: req.user.id, status: 'paid' });
    res.json({ count });
  } catch (error) {
    console.error('Get Bookings Count Error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings count' });
  }
};