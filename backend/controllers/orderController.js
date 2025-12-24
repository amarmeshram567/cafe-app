const Order = require("../models/Order");
const Address = require("../models/Address")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const MenuItem = require("../models/MenuItems");
const User = require("../models/User")



const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        let { items, totalAmount, orderType, paymentMethod, addressId } = req.body;

        if (typeof items === "string") {
            items = JSON.parse(items);
        }

        if (!items || items.length === 0 || !totalAmount || !orderType || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (orderType === "Delivery" && !addressId) {
            return res.status(400).json({
                success: false,
                message: "Delivery address required"
            });
        }

        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            orderType,
            paymentMethod,
            address: orderType === "Delivery" ? addressId : null
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// create order with stripe : /api/orders/strip
// const createOrderStrip = async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         const { items, addressId, orderType } = req.body;
//         const { origin } = req.headers;

//         if (!items || items.length === 0 || !orderType) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid data"
//             });
//         }

//         if (orderType === "Delivery" && !addressId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Delivery address required"
//             });
//         }

//         let totalAmount = 0;
//         let line_items = [];

//         for (let item of items) {
//             const menu = await MenuItem.findById(item.menuItem);

//             totalAmount += menu.price * item.quantity;

//             line_items.push({
//                 price_data: {
//                     currency: "usd", // ✅ USD
//                     product_data: {
//                         name: menu.name
//                     },
//                     unit_amount: Math.round(menu.price * 100) // USD → cents
//                 },
//                 quantity: item.quantity
//             });

//         }

//         // 2% tax
//         totalAmount += Math.round(totalAmount * 0.02);

//         // Create Order (Pending Payment)
//         const order = await Order.create({
//             user: userId,
//             items,
//             orderType,
//             totalAmount,
//             paymentMethod: "ONLINE",
//             address: orderType === "Delivery" ? addressId : null,
//             orderStatus: "Pending"
//         });

//         if (totalAmount < 0.5) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Minimum order amount must be $0.50 for online payment"
//             });
//         }


//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items,
//             mode: "payment",
//             success_url: `${origin}/payment-success?orderId=${order._id}`,
//             cancel_url: `${origin}/`,
//             metadata: {
//                 orderId: order._id.toString(),
//                 userId: userId.toString()
//             }
//         });

//         return res.status(200).json({
//             success: true,
//             url: session.url
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

const createOrderStrip = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items, addressId, orderType } = req.body;
        const { origin } = req.headers;

        if (!items || items.length === 0 || !orderType) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }

        if (orderType === "Delivery" && !addressId) {
            return res.status(400).json({
                success: false,
                message: "Delivery address required"
            });
        }

        let totalAmount = 0;
        let line_items = [];

        for (let item of items) {
            const menu = await MenuItem.findById(item.menuItem);
            if (!menu) continue;

            const itemTotal = menu.price * item.quantity;
            totalAmount += itemTotal;

            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: menu.name
                    },
                    unit_amount: Math.round(menu.price * 100)
                },
                quantity: item.quantity
            });
        }

        // 2% tax
        totalAmount = +(totalAmount * 1.02).toFixed(2);

        // 🔴 Stripe minimum amount check (BEFORE order creation)
        if (totalAmount < 0.5) {
            return res.status(400).json({
                success: false,
                message: "Minimum order amount must be $0.50 for online payment"
            });
        }

        // Create Order (Pending Payment)
        const order = await Order.create({
            user: userId,
            items,
            orderType,
            totalAmount,
            paymentMethod: "ONLINE",
            address: orderType === "Delivery" ? addressId : null,
            orderStatus: "Pending"
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${origin}/payment-success?orderId=${order._id}`,
            cancel_url: `${origin}/`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString()
            }
        });

        return res.status(200).json({
            success: true,
            url: session.url
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




const stripeWebhooks = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {

        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;

            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id
            });

            const { orderId, userId } = sessionList.data[0].metadata;

            await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
                orderStatus: "Preparing"
            });

            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;

            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id
            });

            const { orderId } = sessionList.data[0].metadata;

            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};


// Get my orders : /api/orders/my-orders
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await Order.find({ user: userId }).populate("items.menuItem", "name price imageUrl").populate('address').sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}


// Only for admin
// Get all orders : /api/orders/
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find().populate("user", "name email").populate('items.menuItem', 'name price imageUrl').populate('address').sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All orders fetched successfully",
            orders
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}


// Update order status : /api/orders/update-status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const orderId = req.params.id;

        const validStatuses = [
            "Pending",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// Cancel order : /api/orders/cancel/:id
const cancelOrder = async (req, res) => {
    try {

        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }


        if (order.orderStatus === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Completed orders cannot be cancelled"
            });
        }

        order.orderStatus = "Cancelled";
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}




module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    createOrderStrip,
    stripeWebhooks
}