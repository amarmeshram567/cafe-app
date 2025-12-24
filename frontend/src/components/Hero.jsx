
import { motion } from "framer-motion";
import { Coffee, ShoppingBag } from "lucide-react";

const heroImage =
    "https://images.pexels.com/photos/9789495/pexels-photo-9789495.jpeg";

// Variants
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.25 } },
};

const itemUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6 }}
                className="absolute inset-0"
            >
                <img src={heroImage} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-brown-900/70 to-black/90" />
            </motion.div>

            {/* Content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 text-center px-4 max-w-4xl"
            >
                <motion.div
                    variants={itemUp}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-2 rounded-full mb-6"
                >
                    <Coffee className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">
                        Open 7:00 AM – 10:00 PM
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemUp}
                    className="font-extrabold text-5xl md:text-7xl lg:text-8xl text-white mb-6"
                >
                    Fresh Brews,
                    <br />
                    <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        Fast Delivery
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemUp}
                    className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto"
                >
                    Artisan coffee crafted with love. Order online or book your
                    favorite spot at our cozy café.
                </motion.p>

                <motion.div
                    variants={itemUp}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <motion.a
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px #facc15" }}
                        whileTap={{ scale: 0.95 }}
                        href="#menu"
                        className="flex items-center justify-center w-full sm:w-auto gap-2 px-7 py-3 bg-yellow-400 text-black font-bold rounded-xl text-lg"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Order Online
                    </motion.a>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="#table-bookings"
                        className="w-full sm:w-auto px-7 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-xl text-lg hover:bg-yellow-400 hover:text-black flex justify-center"
                    >
                        Book a Table
                    </motion.a>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default Hero;


