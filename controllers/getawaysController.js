const Getaway = require("../models/Getaway");

// CREATE
exports.createGetaway = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const getaway = new Getaway({ title, description, price, image, createdBy: req.user.id });
    const saved = await getaway.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Getaway Error:", err);
    res.status(400).json({ message: "Failed to create getaway" });
  }
};

// READ ALL
exports.getGetaways = async (req, res) => {
  try {
    const getaways = await Getaway.find().populate("createdBy", "name email role");
    res.json(getaways);
  } catch (err) {
    console.error("Get Getaways Error:", err);
    res.status(500).json({ message: "Failed to fetch getaways" });
  }
};

// READ ONE
exports.getGetawayById = async (req, res) => {
  try {
    const getaway = await Getaway.findById(req.params.id).populate("createdBy", "name email role");
    if (!getaway) return res.status(404).json({ message: "Getaway not found" });
    res.json(getaway);
  } catch (err) {
    console.error("Get Getaway Error:", err);
    res.status(500).json({ message: "Failed to fetch getaway" });
  }
};

// UPDATE
exports.updateGetaway = async (req, res) => {
  try {
    const getaway = await Getaway.findById(req.params.id);
    if (!getaway) return res.status(404).json({ message: "Getaway not found" });

    if (req.user.role !== "Admin" && getaway.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to update this getaway" });

    getaway.title = req.body.title || getaway.title;
    getaway.description = req.body.description || getaway.description;
    getaway.price = req.body.price || getaway.price;
    getaway.image = req.body.image || getaway.image;

    const updated = await getaway.save();
    res.json(updated);
  } catch (err) {
    console.error("Update Getaway Error:", err);
    res.status(400).json({ message: "Failed to update getaway" });
  }
};

// DELETE
exports.deleteGetaway = async (req, res) => {
  try {
    const getaway = await Getaway.findById(req.params.id);
    if (!getaway) return res.status(404).json({ message: "Getaway not found" });

    if (req.user.role !== "Admin" && getaway.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this getaway" });

    await getaway.deleteOne();
    res.json({ message: "Getaway deleted successfully" });
  } catch (err) {
    console.error("Delete Getaway Error:", err);
    res.status(500).json({ message: "Failed to delete getaway" });
  }
};