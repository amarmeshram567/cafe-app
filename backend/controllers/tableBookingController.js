const TableBooking = require("../models/TableBookings");

// create new table booking: /api/booking/create


const createBooking = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { tableNumber, bookingTime, numberOfGuests, name, contactNumber } = req.body;

        if (!tableNumber || !bookingTime || !numberOfGuests || !name || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (new Date(bookingTime) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Booking time must be in the future"
            })
        }

        const existingBooking = await TableBooking.findOne({
            tableNumber,
            bookingTime: new Date(bookingTime),
            status: { $in: ["Pending", "Confirmed"] }
        })

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "This table is already booked for the selected time"
            })
        }

        const newBooking = await TableBooking.create({
            user: userId,
            tableNumber,
            bookingTime,
            numberOfGuests,
            name,
            contactNumber
        })

        return res.status(201).json({
            success: true,
            message: "Table booked successfully",
            booking: newBooking
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// get my bookings: /api/booking/my-bookings
const getMyBookings = async (req, res) => {
    try {

        const userId = req.user.userId;

        const bookings = await TableBooking.find({ user: userId }).sort({ bookingTime: 1 });

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            bookings
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// Access only Admin get all bookings: /api/booking/all
const getAllBookings = async (req, res) => {
    try {
        const bookings = await TableBooking.find({}).populate('user', 'name email').sort({ bookingTime: -1 });

        return res.status(200).json({
            success: true,
            message: "All bookings fetched successfully",
            bookings
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Patch update bookings status : /api/booking/:id/status
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Confirmed", "Cancelled", "Completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const booking = await TableBooking.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// Delete a booking: /api/booking/delete/:id
const deleteBooking = async (req, res) => {
    try {

        const bookingId = req.params.id

        const booking = await TableBooking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            })
        }

        if (booking.status === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Completed booking cannot be cancelled"
            })
        }

        booking.status = "Cancelled";
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    deleteBooking
}