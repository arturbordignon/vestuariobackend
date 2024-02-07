const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  cpf: {
    type: String,
    required: true,
    unique: true,
    length: 11,
  },
  name: {
    type: String,
    required: true,
  },
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

userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
