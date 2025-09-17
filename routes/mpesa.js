const express = require('express');
const router = express.Router();
const { stkPush, getAccessToken, callback } = require('../controllers/mpesaController');
const verifyToken = require('../middleware/auth');

router.get('/access-token', getAccessToken);
router.post('/stkpush', verifyToken, stkPush);
router.post('/callback', callback);

module.exports = router;