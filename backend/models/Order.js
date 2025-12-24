const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MenuItem",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    orderType: {
        type: String,
        enum: ["Dine-In", "Takeaway", "Delivery"],
        required: true
    },

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        default: null
    },

    totalAmount: {
        type: Number,
        required: true
    },

    orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: true
    }

}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;