const Address = require("../models/Address");



// Add Address : /api/address/add
const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.user.userId;

        // Logic to add address to user's address list
        const newAddress = await Address.create({
            ...address,
            userId
        })

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            newAddress
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Get Addresses : /api/address/get
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;

        const addresses = await Address.find({ userId });

        res.status(200).json({
            success: true,
            message: "Addresses fetched successfully",
            addresses
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


const deleteAddress = async (req, res) => {
    try {

        const userId = req.user.userId;
        const addressId = req.params.id;

        const address = await Address.findOne({ _id: addressId, userId })

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            })
        }

        await Address.deleteOne({ _id: addressId, userId })

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


module.exports = {
    addAddress,
    getAddresses,
    deleteAddress
}