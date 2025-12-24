import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Package, ShoppingCart, X, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";

import MyOrders from "./MyOrders";
import OrderCheckout from "../pages/OrderCheckout";
import MyTableBookings from "./MyTableBookings";
import { useAppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";



const actions = [
    { id: "orders", label: "Orders", icon: <Package />, angle: -160, color: "bg-orange-500" }, // left-top
    { id: "checkout", label: "Checkout", icon: <ShoppingCart />, angle: 250, color: "bg-green-500" }, // left-middle
    { id: "table", label: "Table Bookings", icon: <UtensilsCrossed />, angle: -60, color: "bg-purple-500" } // left-bottom
];


const radius = 90;
const getXY = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
};

const FloatingMenu = () => {

    const { menuItems = {}, menus = [] } = useAppContext();

    const cart = menus
        .filter(menu => menuItems[menu._id] > 0)
        .map(menu => ({ ...menu, quantity: menuItems[menu._id] }));

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const location = useLocation()
    const navigate = useNavigate()

    const [panel, setPanel] = useState(location.state?.openPanel || null);
    const [menuOpen, setMenuOpen] = useState(!!location.state?.openPanel);

    const [hovered, setHovered] = useState(null); // track hover for tooltip

    useEffect(() => {
        if (location.state?.openPanel) {
            setPanel(location.state.openPanel)
            setMenuOpen(true)

            navigate(location.pathname, { replace: true, state: null })


        }
    }, [location.state])

    const closeAll = () => {
        setMenuOpen(false);
        setPanel(null);
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {panel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAll}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"

                    />
                )}
            </AnimatePresence>

            {/* Circular Floating Menu */}
            <div className="fixed bottom-6 right-6 z-50 w-40 h-40">
                <div className="relative w-full h-full flex items-center justify-center">
                    {actions.map((item, index) => {
                        const pos = getXY(item.angle);
                        return (
                            <motion.div
                                key={item.id}
                                className="absolute flex flex-col items-center"
                                style={{ left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
                            >
                                <motion.button
                                    initial={false}
                                    animate={{
                                        x: menuOpen ? pos.x : 0,
                                        y: menuOpen ? pos.y : 0,
                                        scale: menuOpen ? 1 : 0,
                                        opacity: menuOpen ? 1 : 0,
                                        rotate: menuOpen ? 0 : -90
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 28, delay: index * 0.06 }}
                                    className={`w-14 h-14 ${item.color} text-white rounded-full shadow-xl flex items-center justify-center relative`}
                                    onClick={() => { setPanel(item.id); setMenuOpen(false); }}
                                    onMouseEnter={() => setHovered(item.id)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    {item.icon}

                                    {item.id === "checkout" && cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-gray-800 text-xs font-bold rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}



                                    {/* Tooltip */}
                                    {hovered === item.id && menuOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: -20 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </motion.button>

                            </motion.div>
                        );
                    })}


                    {/* Main Button */}
                    <motion.button
                        animate={{ rotate: menuOpen ? 45 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="absolute w-16 h-16 bg-sky-500 text-white rounded-full shadow-2xl flex items-center justify-center"
                    >
                        {menuOpen ? <X /> : <Calendar />}
                    </motion.button>
                </div>
            </div>

            {/* Panel */}
            <AnimatePresence>
                {panel && (
                    <motion.div
                        initial={{ y: 300 }}
                        animate={{ y: 0 }}
                        exit={{ y: 300 }}
                        transition={{ type: "spring", damping: 25 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 200 }}
                        onDragEnd={(e, info) => info.offset.y > 120 && closeAll()}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl p-4"
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

                        <h3 className="text-xl font-bold text-center mb-4">
                            {panel === "orders" && "My Orders"}
                            {panel === "checkout" && "Checkout"}
                            {panel === "table" && "Table Bookings"}
                        </h3>

                        {panel === "orders" && <MyOrders />}
                        {panel === "checkout" && <OrderCheckout isOpen={panel === "checkout"} setIsOpen={closeAll} />}
                        {panel === "table" && <MyTableBookings />}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingMenu;
