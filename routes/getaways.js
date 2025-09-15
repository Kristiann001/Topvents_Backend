const express = require("express");
const {
  createGetaway,
  getGetaways,
  getGetawayById,
  updateGetaway,
  deleteGetaway,
} = require("../controllers/getawaysController");
const auth = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getGetaways);
router.get("/:id", getGetawayById);

// Protected routes
router.post("/", auth, createGetaway);
router.put("/:id", auth, updateGetaway);
router.delete("/:id", auth, deleteGetaway);

module.exports = router;
