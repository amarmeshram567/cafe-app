import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, ShoppingCart } from "lucide-react";
import { useAppContext } from '../context/AppContext';

const MenuCard = ({ item, index }) => {

    const { addToCart } = useAppContext()


    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-[hsl(30_30%_98%)] rounded-2xl shadow-md overflow-hidden"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                    {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-black text-white text-sm px-3 py-1 rounded-full">
                    ${item.price.toFixed(2)}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                {/* Actions */}
                <div className="flex justify-center items-center pt-3">
                    <button
                        onClick={() => addToCart(item._id)}
                        className="flex items-center w-full justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Order
                    </button>
                </div>
            </div>
        </motion.article>
    );
}


export default MenuCard;