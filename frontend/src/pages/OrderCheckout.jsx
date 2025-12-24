import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, Minus, Plus, MapPin, CreditCard, Banknote, Truck, Store, UtensilsCrossed } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import api from "../services/app";
import toast from "react-hot-toast";

const OrderCheckout = ({ setIsOpen }) => {
    const { menuItems = {}, menus = [], addToCart, removeFromCart, setMenuItems, user } = useAppContext();

    const [step, setStep] = useState(1);
    const [orderType, setOrderType] = useState("delivery");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedOrder, setSubmittedOrder] = useState(null);

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const cart = menus
        .filter(menu => menuItems[menu._id] > 0)
        .map(menu => ({ ...menu, quantity: menuItems[menu._id] }));

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = orderType === "delivery" ? 2.99 : 0;
    const grandTotal = total + deliveryFee;

    const updateQuantity = (id, delta) => {
        delta > 0 ? addToCart(id) : removeFromCart(id);
    };

    const getUserAddress = async () => {
        try {
            const { data } = await api.get("/api/address/get");
            if (data.success) {
                setSavedAddresses(data.addresses);
                setSelectedAddress(data.addresses[0] || null);
            }
        } catch {
            toast.error("Failed to load addresses");
        }
    };

    const deleteAddress = async (id) => {
        try {
            const { data } = await api.delete(`/api/address/delete/${id}`);
            if (data.success) {
                toast.success("Address deleted");
                setSavedAddresses(prev => prev.filter(a => a._id !== id));
                if (selectedAddress?._id === id) setSelectedAddress(null);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Delete failed");
        }
    };


    const placeOrder = async () => {
        if (orderType === "delivery" && !selectedAddress) return toast.error("Please select an address");
        if (cart.length === 0) return toast.error("Cart is empty");

        const orderTypeMap = {
            "dine-in": "Dine-In",
            takeaway: "Takeaway",
            delivery: "Delivery"
        };

        const payload = {
            items: cart.map(i => ({ menuItem: i._id, quantity: i.quantity })),
            totalAmount: grandTotal,
            orderType: orderTypeMap[orderType],
            paymentMethod: paymentMethod.toUpperCase(),
            addressId: selectedAddress?._id
        };

        try {
            if (paymentMethod === 'online') {
                const { data } = await api.post("/api/orders/online-stripe", payload)
                if (data.success) {
                    window.location.href = data.url
                }
                else {
                    toast.error(data.message)
                }
            }
            else {
                const codPayload = {
                    ...payload,
                    totalAmount: grandTotal,
                    paymentMethod: "COD"
                }

                const { data } = await api.post("/api/orders/create-cod", codPayload)
                if (data.success) {
                    toast.success("Order placed successfully")
                    setSubmittedOrder(codPayload)
                    setIsSubmitted(true)
                    setMenuItems({})
                }
                else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Order failed");
        }
    };


    const resetOrder = () => {
        setIsSubmitted(false);
        setStep(1);
        setPaymentMethod("online");
        setOrderType("delivery");
        setMenuItems({});
        setIsOpen(false);
    };

    useEffect(() => {
        if (user) getUserAddress();
    }, [user]);

    return (
        <div className="p-3">
            {isSubmitted ? (
                <div className="text-center p-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="w-10 h-10 text-orange-500" />
                    </motion.div>
                    <h4 className="text-2xl font-bold mb-2">Thank You!</h4>
                    <p className="text-gray-600 mb-6">
                        Your order has been placed. {submittedOrder?.orderType === "Delivery" ? "We'll deliver it soon!" : "See you at the café!"}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Order Total: <span className="font-bold text-gray-800">${submittedOrder?.totalAmount?.toFixed(2)}</span>
                        <br />
                        Payment: {submittedOrder?.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                    <button onClick={resetOrder} className="px-6 py-3 bg-orange-500 text-white rounded-full">
                        Place Another Order
                    </button>
                </div>
            ) : (
                <>
                    {/* Step 1: Cart & Order Type */}
                    {step === 1 && (
                        <div>
                            <p className="text-sm text-gray-500 mb-4">How would you like your order?</p>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[{ type: "dine-in", icon: UtensilsCrossed, label: "Dine-in" },
                                { type: "takeaway", icon: Store, label: "Takeaway" },
                                { type: "delivery", icon: Truck, label: "Delivery" }]
                                    .map(({ type, icon: Icon, label }) => (
                                        <button
                                            key={type}
                                            onClick={() => setOrderType(type)}
                                            className={`p-3 rounded-xl border-2 w-full ${orderType === type ? "border-orange-500 bg-orange-100" : "border-gray-200"}`}
                                        >
                                            <Icon className={`w-6 h-6 mx-auto mb-2 ${orderType === type ? "text-orange-500" : "text-gray-400"}`} />
                                            <span className={`text-sm font-medium ${orderType === type ? "text-orange-500" : "text-gray-400"}`}>{label}</span>
                                        </button>
                                    ))}
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-2 mb-6">
                                {cart.map(item => (
                                    <div key={item._id} className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
                                        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 font-medium truncate">{item.name}</p>
                                            <p className="text-orange-500 font-semibold">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(item._id, -1)} className="w-8 h-8 bg-white flex items-center justify-center hover:bg-gray-200">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-medium">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setStep(2)} disabled={cart.length === 0} className="w-full py-3 bg-orange-500 text-white rounded-full disabled:opacity-50">
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: Address & Payment */}
                    {step === 2 && (
                        <div>
                            {orderType === "delivery" && (
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Delivery Address
                                    </label>

                                    {savedAddresses.length > 0 ? (
                                        <div className="space-y-3 h-30 overflow-y-scroll">
                                            {savedAddresses.map(addr => (
                                                <div
                                                    key={addr._id}
                                                    className={`relative p-3 border-2 rounded-lg cursor-pointer group ${selectedAddress?._id === addr._id
                                                        ? "border-orange-500 bg-orange-100"
                                                        : "border-gray-300"
                                                        }`}
                                                    onClick={() => setSelectedAddress(addr)}
                                                >
                                                    <p className="text-sm">{addr.street}, {addr.city}, {addr.state}</p>
                                                    <p className="text-xs text-gray-500">{addr.phone}</p>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteAddress(addr._id);
                                                        }}
                                                        className="absolute top-5 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            ))}

                                            <a
                                                href="/address"
                                                className="block p-3 border-2 rounded-lg border-gray-300 text-center text-gray-500 font-semibold hover:border-orange-400 hover:text-orange-500"
                                            >
                                                + Add New Address
                                            </a>
                                        </div>
                                    ) : (
                                        <a
                                            href="/address"
                                            className="block p-3 border-2 border-gray-200 rounded text-center text-gray-500 font-semibold"
                                        >
                                            Add Address
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Payment */}
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment Method
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod("online")}
                                        className={`p-4 rounded-xl border-2 ${paymentMethod === "online" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-gray-200"
                                            }`}
                                    >
                                        <CreditCard className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">UPI / Card</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`p-4 rounded-xl border-2 ${paymentMethod === "cod" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-gray-200"
                                            }`}
                                    >
                                        <Banknote className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Cash</span>
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gray-100 rounded-xl p-4 mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-800">${total.toFixed(2)}</span>
                                </div>
                                {orderType === "delivery" && (
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Delivery Fee</span>
                                        <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-orange-500">${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 border rounded-full"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={placeOrder}
                                    disabled={orderType === "delivery" && !selectedAddress}
                                    className="flex-1 py-3 bg-orange-500 text-white rounded-full disabled:opacity-50"
                                >
                                    Place Order
                                </button>
                            </div>

                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderCheckout;
