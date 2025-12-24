const mongoose = require("mongoose");


const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ["Coffee", "Snacks", "Dessert", "Pastry", "Brunch"], required: true },
    imageUrl: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
