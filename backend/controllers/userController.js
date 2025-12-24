const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/User');


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',

            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",

            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
        })

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        })


    } catch (error) {
        console.error("Error in register controller:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',

            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error("Error in register controller:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

const isAuth = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        return res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const logout = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        res.json({
            success: true,
            message: "Logout successfully"
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    register,
    login,
    isAuth,
    logout
}