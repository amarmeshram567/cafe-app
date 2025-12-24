const express = require("express");
const { createOrder, getMyOrders, updateOrderStatus, cancelOrder, getAllOrders, createOrderStrip } = require("../controllers/orderController");
const authUser = require("../middleware/authUser");

const orderRouter = express.Router();



orderRouter.post("/create-cod", authUser, createOrder);
// strip 
orderRouter.post('/online-stripe', authUser, createOrderStrip)

orderRouter.get("/my-orders", authUser, getMyOrders);

// admin
orderRouter.get("/all-orders", getAllOrders)
orderRouter.post("/update-status/:id", updateOrderStatus);

// user
orderRouter.post("/cancel/:id", cancelOrder);


module.exports = orderRouter
