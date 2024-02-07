const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    clothing: { type: mongoose.Schema.Types.ObjectId, ref: "Clothing", required: true },
    messages: [
      {
        senderRole: { type: String, required: true, enum: ["user", "admin"] },
        sender: { type: mongoose.Schema.Types.ObjectId, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
