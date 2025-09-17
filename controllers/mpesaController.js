exports.getAccessToken = async (req, res) => {
  try {
    // Stub: return fake token for dev/testing
    res.json({ access_token: "dev-access-token", expires_in: 3600 });
  } catch (err) {
    console.error("Get Access Token Error:", err);
    res.status(500).json({ message: "Failed to get access token" });
  }
};

exports.stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Log and respond (you can plug your M-Pesa Daraja integration here)
    console.log(`Initiating STK Push to ${phone} for KES ${amount}`);

    // Fake successful response for testing purposes
    res.json({ message: `STK Push sent to ${phone} for KES ${amount}` });
  } catch (err) {
    console.error("STK Push Error:", err);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};
