const axios = require('axios');
const base64 = require('base-64');
const Order = require('../models/Order');

const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw new Error('Failed to get access token from M-Pesa API');
  }
};

const generatePassword = (shortcode, passkey, timestamp) => {
  const password = `${shortcode}${passkey}${timestamp}`;
  return base64.encode(password);
};

exports.getAccessToken = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    res.json({ access_token: accessToken, expires_in: 3600 });
  } catch (error) {
    console.error('Get Access Token Error:', error.message);
    res.status(500).json({ message: 'Failed to get access token' });
  }
};

exports.stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const userId = req.user?.id;

    if (!phone || !amount || !userId) {
      return res.status(400).json({ message: 'Phone number, amount, and user authentication are required' });
    }

    let phoneNumber = phone;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '254' + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith('254')) {
      phoneNumber = '254' + phoneNumber;
    }

    if (!/^254\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = generatePassword(shortcode, passkey, timestamp);
    const accessToken = await getAccessToken();

    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: parsedAmount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'PIYE',
      TransactionDesc: 'Payment to PIYE',
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    await Order.updateOne(
      { phone: phoneNumber, createdBy: userId, status: 'pending' },
      { mpesaResponse: { checkoutRequestID: response.data.CheckoutRequestID } }
    );

    res.json({ message: 'Payment initiated', data: response.data });
  } catch (error) {
    console.error('STK Push Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to initiate payment' });
  }
};

exports.callback = async (req, res) => {
  try {
    const { Body: { stkCallback } } = req.body;
    console.log('M-Pesa Callback:', JSON.stringify(stkCallback, null, 2));
    if (stkCallback.ResultCode === 0) {
      const checkoutRequestID = stkCallback.CheckoutRequestID;
      await Order.findOneAndUpdate(
        { 'mpesaResponse.checkoutRequestID': checkoutRequestID },
        { status: 'paid', mpesaResponse: stkCallback },
        { new: true }
      );
      console.log('Payment successful:', stkCallback);
    } else {
      console.error('Payment failed:', stkCallback.ResultDesc);
    }
    res.status(200).json({ message: 'Callback received' });
  } catch (error) {
    console.error('Callback Error:', error.message);
    res.status(500).json({ message: 'Failed to process callback' });
  }
};