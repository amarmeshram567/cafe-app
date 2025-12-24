import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";


const menuItems = [
    {
        id: 1,
        name: "Classic Cappuccino",
        price: 4.5,
        description:
            "Velvety steamed milk with rich espresso and beautiful latte art. Our signature drink.",
        images: ["https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg"],
        category: "Coffee",
        likes: 234,
    },
    {
        id: 2,
        name: "Butter Croissant",
        price: 3.75,
        description: "Flaky, golden layers of buttery goodness. Freshly baked every morning.",
        images: ["https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg"],
        category: "Pastry",
        likes: 189,
    },
    {
        id: 3,
        name: "Caramel Iced Latte",
        price: 5.25,
        description:
            "Cool and refreshing with our house-made caramel sauce and whipped cream.",
        images: ["https://images.pexels.com/photos/32713605/pexels-photo-32713605.jpeg"],
        category: "Coffee",
        likes: 312,
    },
    {
        id: 4,
        name: "Chocolate Brownie",
        price: 4.25,
        description:
            "Rich, fudgy brownie topped with chocolate ganache and roasted walnuts.",
        images: ["https://images.pexels.com/photos/27359377/pexels-photo-27359377.jpeg"],
        category: "Dessert",
        likes: 276,
    },
    {
        id: 5,
        name: "Avocado Toast",
        price: 8.5,
        description:
            "Smashed avocado on sourdough with poached egg, cherry tomatoes & microgreens.",
        images: ["https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg"],
        category: "Brunch",
        likes: 198,
    },
    {
        id: 6,
        name: "Double Espresso",
        price: 3.25,
        description:
            "Bold and intense. Two shots of our premium single-origin espresso.",
        images: ["https://images.pexels.com/photos/14305840/pexels-photo-14305840.jpeg"],
        category: "Coffee",
        likes: 156,
    },
];
const ItemDetails = () => {

    const { id } = useParams();
    const item = menuItems.find(i => i.id === parseInt(id));
    if (!item) return <p>Item not found</p>;

    const [quantity, setQuantity] = useState(1);
    const [imageThumbnail, setImageThumbnail] = useState(item.images[0]);

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const addToCart = () => console.log(`Added ${quantity} x ${item.name} to cart`);

    return (
        <section className="px-4 py-16 md:py-20 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-8"
            >
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-3 justify-center md:justify-start md:w-1/6 overflow-x-auto md:overflow-visible">
                    {item.images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setImageThumbnail(image)}
                            className={`border rounded-lg overflow-hidden shrink-0 
          ${imageThumbnail === image ? "border-orange-400" : "border-muted"}`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-20 h-20 md:w-24 md:h-24 object-cover"
                            />
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={imageThumbnail}
                        alt={item.name}
                        className="w-full max-w-sm md:max-w-full aspect-square object-cover rounded-2xl shadow-lg"
                    />
                </div>

                {/* Item Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-between text-center md:text-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            {item.name}
                        </h1>

                        <p className="text-orange-700 text-2xl font-semibold mb-4">
                            ${item.price.toFixed(2)}
                        </p>

                        <p className="text-muted-foreground mb-6">
                            {item.description}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                            <button
                                onClick={decrement}
                                className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg hover:bg-secondary transition"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <span className="text-lg font-medium">{quantity}</span>

                            <button
                                onClick={increment}
                                className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg hover:bg-secondary transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={addToCart}
                            className="mx-auto md:mx-0 flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-caramel transition"
                        >
                            <ShoppingBag className="w-5 h-5" /> Add to Cart
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>

    );
};

export default ItemDetails
