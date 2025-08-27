// routes/HealthCardRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  registerHealthCard,
  getHealthCardDetails,
} = require("../controllers/HealthCardController");
const HealthCard = require("../models/HealthCard");
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "uploads");
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      return cb(e);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Route to handle health card registration (accept any file and pick 'photo' in controller)
router.post("/register", upload.any(), registerHealthCard);

// Route to get health card details by email
router.get("/details/:email", getHealthCardDetails);

// Admin: list all health cards
router.get("/all", async (req, res) => {
  try {
    const cards = await HealthCard.find().sort({ createdAt: -1 });
    res.json({ healthCards: cards });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// Admin: update a health card
router.put("/:id", upload.any(), async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    const file = Array.isArray(req.files)
      ? req.files.find((f) => f.fieldname === "photo")
      : req.file;
    if (file) update.photoUrl = `/uploads/${file.filename}`;
    const updated = await HealthCard.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Health card not found" });
    res.json({ message: "Updated successfully", healthCard: updated });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// Admin: delete a health card
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HealthCard.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Health card not found" });
    res.json({ message: "Deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

module.exports = router;
