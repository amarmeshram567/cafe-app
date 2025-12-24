const express = require("express");
const { createBooking, getMyBookings, updateBookingStatus, deleteBooking, getAllBookings } = require("../controllers/tableBookingController");
const authUser = require("../middleware/authUser");
const authSeller = require("../middleware/authSeller");

const tableRouter = express.Router()



tableRouter.post("/create", authUser, createBooking);
tableRouter.get("/my-bookings", authUser, getMyBookings);
tableRouter.delete("/delete/:id", authUser, deleteBooking);

// admin 
tableRouter.get('/all', authSeller, getAllBookings)
tableRouter.patch("/:id/status", authSeller, updateBookingStatus);


module.exports = tableRouter;


