require("dotenv").config();
const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser")

const userRouter = require("./routes/userRoutes");
const menuRouter = require("./routes/menuRoutes");
const tableRouter = require("./routes/tableBookingRoutes");
const addressRouter = require("./routes/addressRoutes");
const orderRouter = require("./routes/orderRoutes");
const menuItemRouter = require("./routes/menuItemRoutes");
const connectDB = require("./config/db");
const sellerRouter = require("./routes/sellerRoutes");


const app = express();

const PORT = process.env.PORT || 8000;

// database 
connectDB()

const allowedOrigins = ['https://cafe-app-client.vercel.app']

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))




app.get("/", (req, res) => {
    res.send("Cafe App Backend is running");
})

// user routes
app.use("/api/users", userRouter);
app.use("/api/menu", menuRouter);
app.use("/api/table-bookings", tableRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/menu-items", menuItemRouter);
app.use("/api/seller", sellerRouter)





app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})