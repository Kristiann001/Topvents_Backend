exports.stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Here you can call your MPESA API integration
    console.log(`Initiating STK Push to ${phone} for KES ${amount}`);

    // Fake response for testing
    res.json({ message: `STK Push sent to ${phone} for KES ${amount}` });
  } catch (err) {
    console.error("STK Push Error:", err);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};
