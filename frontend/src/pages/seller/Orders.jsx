import React, { useEffect, useState } from 'react';
import api from '../../services/app';
import { toast } from "react-hot-toast"

const Orders = () => {

    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/api/orders/all-orders")
            if (data.success) {
                // console.log(data.orders)
                setOrders(data.orders)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    console.log(orders)

    const updateStatus = async (orderId, status) => {
        try {
            const { data } = await api.post(
                `/api/orders/update-status/${orderId}`,
                { status }
            );

            if (data.success) {
                setOrders(prev =>
                    prev.map(order =>
                        order._id === orderId
                            ? { ...order, orderStatus: status }
                            : order
                    )
                );
                toast.success("Order status updated");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    useEffect(() => {
        fetchOrders()
    }, [])





    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>

                {orders.map(order => (
                    <div
                        key={order._id}
                        className="flex flex-col md:flex-row md:items-center gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 bg-white"
                    >

                        {/* Left: Image + Items */}
                        <div className="flex gap-5 max-w-80">
                            <img
                                className="w-12 h-12 object-cover rounded-md"
                                src={order.items[0]?.menuItem?.imageUrl}
                                alt="menu"
                            />

                            <div>
                                {order.items.map(item => (
                                    <p key={item._id} className="font-medium text-sm">
                                        {item.menuItem.name}
                                        <span className="text-orange-500 ml-1">x {item.quantity}</span>
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="text-sm text-black/60 max-w-xs">
                            <p className="text-orange-500 font-semibold uppercase">
                                {order.user.name}
                            </p>
                            {
                                order.address ? (
                                    <>
                                        <p>{order.address.street}, {order.address.city}</p>
                                        <p>{order.address.state}, {order.address.phone}</p>
                                    </>
                                ) : (
                                    <p className='font-semibold text-gray-400'>
                                        {order.orderType} Order
                                    </p>
                                )
                            }
                        </div>

                        {/* Amount */}
                        <p className="font-medium text-lg">
                            ${order.totalAmount}
                        </p>

                        {/* Status */}
                        <div className="flex items-center">
                            {order.orderStatus === "Cancelled" ? (
                                <span className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-full">
                                    Cancelled
                                </span>
                            ) : (
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                    className="border border-gray-400 px-3 py-1 rounded-md outline-orange-500 text-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>

    );
}

export default Orders;
