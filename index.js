require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const getawayRoutes = require("./routes/getaways");
const stayRoutes = require("./routes/stays");
const orderRoutes = require("./routes/orders");
const mpesaRoutes = require("./routes/mpesa");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/getaways", getawayRoutes);
app.use("/api/stays", stayRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mpesa", mpesaRoutes);

// Root
app.get("/", (req, res) => res.send("API is running..."));

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));