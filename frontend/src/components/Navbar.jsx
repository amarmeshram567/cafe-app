import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleUserRoundIcon, Coffee, LogOut, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/app";

const navLinks = [
    { href: "#menu", label: "Menu" },
    { href: "#table-bookings", label: "Book Table" },
    { href: "#visit", label: "Visit Us" },
];

const Navbar = () => {

    const { user, setUser, setShowUserLogin } = useAppContext()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const logout = async () => {
        try {
            const { data } = await api.get("/api/users/logout", {
                withCredentials: true
            });

            if (data.success) {
                toast.success(data.message);
                setUser(null);
                navigate("/");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };



    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isScrolled ? "bg-orange-500" : "bg-gray-200/20"
                                }`}
                        >
                            <Coffee
                                className={`w-5 h-5 ${isScrolled ? "text-white" : "text-white"
                                    }`}
                            />
                        </div>
                        <span
                            className={`font-bold text-xl transition-colors ${isScrolled ? "text-gray-700" : "text-gray-200"
                                }`}
                        >
                            Brew & Co.
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`font-medium transition-colors hover:text-orange-500 ${isScrolled ? "text-gray-800" : "text-gray-200"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}


                        {
                            !user ? (
                                <button
                                    onClick={() => setShowUserLogin(true)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isScrolled
                                        ? "bg-orange-500 text-white"
                                        : "bg-white/20 text-gray-200"
                                        }`}
                                >
                                    Login Now
                                </button>
                            ) : (
                                <div className="relative">
                                    <CircleUserRoundIcon onClick={() => setOpen(!open)} className={`w-10 ${isScrolled ? "text-gray-800" : "text-gray-200"}`} />
                                    {
                                        open && (
                                            <div className="absolute top-10 right-0 bg-white shadow border border-gray-200  w-20 rounded-md text-sm z-40">
                                                <p onClick={() => {
                                                    logout();
                                                    setOpen(false);
                                                }} className="p-1 pl-3 hover:text-orange-500 cursor-pointer"
                                                >
                                                    Logout
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors 
                        ${isScrolled ? "bg-orange-500" : "bg-gray-200/20"}
                        `}
                    >
                        <Menu
                            className={`w-5 h-5 ${isScrolled ? "text-white" : "text-gray-200"}`}
                        />
                    </button>

                </div>
            </motion.nav>



            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg md:hidden"
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white p-6"
                        >
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center ml-auto mb-8"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col gap-4">
                                {navLinks.map((link, index) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-2xl font-bold text-gray-800 hover:text-orange-500 transition-colors py-2"
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}

                                {!user ? (
                                    <motion.button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setShowUserLogin(true);
                                        }}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="w-full block text-center py-3 bg-orange-500 text-white rounded-lg font-medium mt-4"
                                    >
                                        Login Now
                                    </motion.button>
                                ) : (
                                    <div className="relative mt-4">
                                        <div
                                            onClick={() => setOpen(!open)}
                                            className="flex flex-row justify-center items-center gap-2  cursor-pointer px-4 py-3 bg-gray-100 rounded-lg"
                                        >
                                            <CircleUserRoundIcon className="w-6 h-6 text-gray-800" />
                                            <span className="text-gray-800 uppercase font-semibold">{user.name}</span>
                                        </div>
                                        {open && (
                                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md z-40">
                                                <p
                                                    onClick={() => {
                                                        logout();
                                                        setOpen(false);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className="p-2 hover:text-orange-500 cursor-pointer"
                                                >
                                                    Logout
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </>
    );
};

export default Navbar;
