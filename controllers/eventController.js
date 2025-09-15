const Event = require("../models/Event");

// CREATE
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.userId,
    });

    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(400).json({ message: "Failed to create event" });
  }
};

// READ ALL
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email role");
    res.json(events);
  } catch (err) {
    console.error("Get Events Error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// READ ONE
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email role");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Get Event Error:", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

// UPDATE
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.userRole !== "Admin" && event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;

    const updated = await event.save();
    res.json(updated);
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(400).json({ message: "Failed to update event" });
  }
};

// DELETE
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.userRole !== "Admin" && event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
