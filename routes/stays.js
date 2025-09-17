const express = require("express");
const { 
  createStay, 
  getStays, 
  getStayById, 
  updateStay, 
  deleteStay 
} = require("../controllers/staysController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getStays);
router.get("/:id", getStayById);
router.post("/", auth, createStay);
router.put("/:id", auth, updateStay);
router.delete("/:id", auth, deleteStay);

module.exports = router;