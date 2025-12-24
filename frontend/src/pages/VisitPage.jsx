import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, Clock, MapPin } from "lucide-react";

const visitItems = [
    {
        title: "Fresh Ingredients",
        description: "Locally sourced produce & premium quality meats",
        icon: "🥬",
    },
    {
        title: "Expert Chefs",
        description: "Award-winning culinary professionals",
        icon: "👨‍🍳",
    },
    {
        title: "Cozy Ambiance",
        description: "Elegant dining space for every occasion",
        icon: "🕯️",
    },
]

const VisitPage = () => {



    return (
        <div id="visit" className="min-h-screen items-center p-2 bg-gradient-to-br from-orange-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Decorations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-6xl mx-auto px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", damping: 15 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500 shadow-xl mb-8"
                        >
                            <UtensilsCrossed className="w-10 h-10 text-white" />
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Welcome to <span className="text-orange-500">Brew & Co.</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8">
                            Experience culinary excellence in a warm and inviting atmosphere.
                            Register your visit and we’ll prepare your table.
                        </p>

                        {/* Info */}
                        <div className="flex justify-center gap-4 mb-10 flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-gray-800 font-semibold text-sm">
                                <Clock size={16} /> Open 7am - 10pm
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-gray-800 font-semibold text-sm">
                                <MapPin size={16} /> 123 Gourmet Street
                            </div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-orange-600 font-semibold text-lg italic"
                        >
                            “Walk in, relax, and let us serve you the finest flavors.”
                        </motion.p>

                    </motion.div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6">
                    {visitItems.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-white flex border border-gray-100 flex-col hover:scale-105 duration-500 cursor-pointer justify-center text-orange-500 sm:items-center rounded-2xl p-6 shadow hover:shadow-lg transition"
                        >
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VisitPage;
