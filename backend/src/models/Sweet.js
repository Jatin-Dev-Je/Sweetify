const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  owner: { type: String, required: true }
});

module.exports = mongoose.model("Sweet", sweetSchema);
