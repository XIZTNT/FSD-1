// models/quoteSchema.js
const mongoose = require("mongoose");
//NPM Validator Import
const validator = require ('validator');

const quoteSchema = new mongoose.Schema({
  building_type: {
    type: String,
    required: true,
    validate: {
      validator: (value) => ["residential", "commercial", "industrial"].includes(value.toLowerCase()),
      message: "Building type must be residential, commercial, or industrial",
    },
  },
  // other fields can remain unvalidated or optional
  numFloors: Number,
  numApts: Number,
  maxOccupancy: Number,
  numElevators: Number,
  productLine: String,
  unitPrice: Number,
  elevatorCost: Number,
  installationFee: Number,
  totalCost: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quote", quoteSchema);

