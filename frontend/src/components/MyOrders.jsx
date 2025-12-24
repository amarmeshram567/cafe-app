import { useEffect, useState } from "react";
import { Package, MapPin } from "lucide-react";
import api from "../services/app";
import toast from "react-hot-toast";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getOrders = async () => {
        try {
            const { data } = await api.get("/api/orders/my-orders");
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this order?"
            );
            if (!confirmCancel) return;

            const { data } = await api.post(
                `/api/orders/cancel/${orderId}`,
                {},
                { withCredentials: true }
            );

            if (data.success) {
                toast.success("Order cancelled successfully");
                setOrders(prev =>
                    prev.map(order =>
                        order._id === orderId
                            ? { ...order, orderStatus: "Cancelled" }
                            : order
                    )
                );
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            )
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Header */}
            {/* <div className="flex items-center gap-2">
                <Package className="text-orange-500" />
                <h3 className="text-xl font-bold">My Orders</h3>
            </div> */}

            {loading ? (
                <p className="text-center text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-center text-gray-500">
                    No orders yet 🛒
                </p>
            ) : (
                orders.map(order => (
                    <div
                        key={order._id}
                        className="border border-gray-300 rounded-xl p-4 space-y-2"
                    >
                        {/* Order header */}
                        <div className="flex justify-between">
                            <p className="font-semibold">
                                Order #{order._id.slice(-6)}
                            </p>
                            <span className="text-sm text-orange-500">
                                {order.orderStatus}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>

                        {/* Items */}
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={item.menuItem.imageUrl}
                                        alt={item.menuItem.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />

                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {item.menuItem.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="text-sm font-semibold text-orange-500">
                                        ${item.menuItem.price}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Address */}
                        {order.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                                <MapPin className="w-4 h-4" />
                                {order.address.street}, {order.address.city}
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex justify-between font-semibold border-t-2 border-gray-100 pt-2 mt-2">
                            <span>
                                {order.paymentMethod === "COD"
                                    ? "Cash on Delivery"
                                    : "Online Payment"}
                            </span>
                            <span className="text-orange-500">
                                ${order.totalAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Cancel */}
                        {order.orderStatus === "Pending" && (
                            <button
                                onClick={() => cancelOrder(order._id)}
                                className="w-full mt-2 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-400 rounded-lg hover:bg-orange-50"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;

