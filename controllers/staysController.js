const Stay = require("../models/Stay");

// CREATE
exports.createStay = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const stay = new Stay({ title, description, price, image, createdBy: req.user.id });
    const saved = await stay.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Stay Error:", err);
    res.status(400).json({ message: "Failed to create stay" });
  }
};

// READ ALL
exports.getStays = async (req, res) => {
  try {
    const stays = await Stay.find().populate("createdBy", "name email role");
    res.json(stays);
  } catch (err) {
    console.error("Get Stays Error:", err);
    res.status(500).json({ message: "Failed to fetch stays" });
  }
};

// READ ONE
exports.getStayById = async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id).populate("createdBy", "name email role");
    if (!stay) return res.status(404).json({ message: "Stay not found" });
    res.json(stay);
  } catch (err) {
    console.error("Get Stay Error:", err);
    res.status(500).json({ message: "Failed to fetch stay" });
  }
};

// UPDATE
exports.updateStay = async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) return res.status(404).json({ message: "Stay not found" });

    if (req.user.role !== "Admin" && stay.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to update this stay" });

    stay.title = req.body.title || stay.title;
    stay.description = req.body.description || stay.description;
    stay.price = req.body.price || stay.price;
    stay.image = req.body.image || stay.image;

    const updated = await stay.save();
    res.json(updated);
  } catch (err) {
    console.error("Update Stay Error:", err);
    res.status(400).json({ message: "Failed to update stay" });
  }
};

// DELETE
exports.deleteStay = async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) return res.status(404).json({ message: "Stay not found" });

    if (req.user.role !== "Admin" && stay.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this stay" });

    await stay.deleteOne();
    res.json({ message: "Stay deleted successfully" });
  } catch (err) {
    console.error("Delete Stay Error:", err);
    res.status(500).json({ message: "Failed to delete stay" });
  }
};