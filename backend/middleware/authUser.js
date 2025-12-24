const jwt = require("jsonwebtoken")
const User = require("../models/User")


const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        // console.log(jwt.decode(req.cookies.token));


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = {
            userId: user._id,
            role: user.role,
        }

        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        })
    }
}

module.exports = authUser