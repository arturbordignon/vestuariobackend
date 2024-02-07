const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: "Insira um email válido",
    },
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.passwordHash);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
