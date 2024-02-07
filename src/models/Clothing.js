const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  gender: { type: String, required: true },
  condition: { type: String, required: true },
  season: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, default: "disponível" },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
});

module.exports = mongoose.model("Clothing", clothingSchema);
