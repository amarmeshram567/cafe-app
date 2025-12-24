const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tableNumber: { type: Number, required: true },
    bookingTime: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' }
}, { timestamps: true });

const TableBooking = mongoose.model('TableBooking', bookingSchema);

module.exports = TableBooking;