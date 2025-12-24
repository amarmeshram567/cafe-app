import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MenuCard from "../components/MenuItems";
import { useAppContext } from "../context/AppContext";

const categories = ["All", "Coffee", "Pastry", "Brunch", "Dessert"];

const Menu = () => {
    const { menus } = useAppContext();
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredItems =
        activeCategory === "All"
            ? menus
            : menus.filter((item) => item.category === activeCategory);

    return (
        <section id="menu" className="py-16 md:py-24 bg-[linear-gradient(135deg,_hsl(30_40%_88%)_0%,_hsl(35_40%_92%)_100%)]">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                            Fresh Picks
                        </span>
                        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                            Today’s Favorites
                        </h2>
                    </div>

                    {/* Desktop link */}
                    <Link
                        to="/menu"
                        className="hidden sm:flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-500 hover:scale-110 duration-500"
                    >
                        View Full Menu
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Categories */}
                <div className="flex justify-center flex-wrap gap-3 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 rounded-full text-sm transition
                ${activeCategory === category
                                    ? "bg-orange-500 text-white"
                                    : "bg-white hover:bg-orange-100"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.slice(0, 6).map((item, index) => (
                        <div
                            key={item._id}
                            className="animate-scale-in"
                            style={{ animationDelay: `${0.1 * index}s` }}
                        >
                            <MenuCard item={item} index={index} />
                        </div>
                    ))}
                </div>

                {/* Mobile link */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600  hover:scale-110 duration-500"
                    >
                        View Full Menu
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Menu;
