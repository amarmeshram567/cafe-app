const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log("Database connected")
        }).catch((err) => {
            console.log(err)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB