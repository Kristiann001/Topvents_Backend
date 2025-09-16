const express = require("express");
const router = express.Router();
const { stkPush, getAccessToken } = require("../controllers/mpesaController");

// Route to get access token
router.get("/access-token", getAccessToken);

// Route to initiate STK push
router.post("/stkpush", stkPush);

module.exports = router;
