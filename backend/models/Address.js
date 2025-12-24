const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    zipcode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true }
}, { timestamps: true });


const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
