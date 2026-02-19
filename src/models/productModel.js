const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    files: {
      type: Array,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
