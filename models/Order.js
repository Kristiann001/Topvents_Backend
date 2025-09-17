// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: false },
        title: String,
        description: String,
        price: String,
        image: String,
        type: String,
      },
    ],
    amount: { type: String, required: true }, // keep string to remain compatible with your UI
    phone: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    mpesaResponse: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
