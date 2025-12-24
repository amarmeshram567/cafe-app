import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function RegisterForm({ onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Register submitted:", { name, email, password });
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg"
        >
            {/* Heading */}
            <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="text-3xl font-semibold mb-2">Create Account</h1>
                <p className="text-gray-500 text-sm">
                    Join us today and start your journey
                </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm mb-1">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </motion.div>

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-2">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500">
                            Already have an account?
                        </span>
                    </div>
                </motion.div>

                {/* Switch */}
                <motion.div variants={itemVariants}>
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="w-full border border-black py-2 rounded-lg hover:bg-black hover:text-white transition"
                    >
                        Sign in instead
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
}
