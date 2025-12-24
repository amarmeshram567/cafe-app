require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("../routes/userRoutes");
const menuRouter = require("../routes/menuRoutes");
const tableRouter = require("../routes/tableBookingRoutes");
const addressRouter = require("../routes/addressRoutes");
const orderRouter = require("../routes/orderRoutes");
const menuItemRouter = require("../routes/menuItemRoutes");
const sellerRouter = require("../routes/sellerRoutes");
const connectDB = require("../config/db");

const app = express();

// database
connectDB();


const allowedOrigins = [
    "https://cafe-app-uheh.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Cafe App Backend is running 🚀");
});

app.use("/api/users", userRouter);
app.use("/api/menu", menuRouter);
app.use("/api/table-bookings", tableRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/menu-items", menuItemRouter);
app.use("/api/seller", sellerRouter);


module.exports = app;
