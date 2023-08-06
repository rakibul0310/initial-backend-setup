const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_id: { type: String, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: false },
  mobile: { type: String, required: true },
  sponsor_id: { type: String, required: true, default: "tlc001" },
  sponsor_name: { type: String, required: true, default: "Admin" },
  token: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
