import { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import MenuCard from "../components/MenuItems";
import {
    Search,
    Coffee,
    Croissant,
    UtensilsCrossed,
    Cake,
    LayoutGrid
} from "lucide-react";

const categories = [
    { name: "All", icon: <LayoutGrid className="h-4 w-4" /> },
    { name: "Coffee", icon: <Coffee className="h-4 w-4" /> },
    { name: "Pastry", icon: <Croissant className="h-4 w-4" /> },
    { name: "Brunch", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { name: "Dessert", icon: <Cake className="h-4 w-4" /> }
];


const heroImage =
    "https://images.pexels.com/photos/9789495/pexels-photo-9789495.jpeg";


const heroStyle = {
    backgroundImage: `
    linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.7)),
    url(${heroImage})
  `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
};




const FullMenu = () => {
    const { menus } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredMenus = useMemo(() => {
        return menus.filter((item) => {
            const matchesSearch =
                searchQuery === "" ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                activeCategory === "All" || item.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [menus, searchQuery, activeCategory]);

    return (
        <section style={heroStyle} className="min-h-screen py-20 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4">

                {/* Title */}
                <div className="items-start mb-10">
                    <h1
                        className="text-3xl md:text-4xl font-bold uppercase"
                        style={{
                            background: "linear-gradient(90deg, #ffffff, #facc15, #f97316)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Our Menu
                    </h1>
                    <p className="text-gray-50 text-sm mt-2 italic">
                        “Discover our carefully crafted selection of drinks and treats”
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search menu items..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-gray-50 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center text-gray-800 gap-2 px-5 py-2 rounded-full text-sm transition
                                ${activeCategory === cat.name
                                    ? "bg-orange-500 text-white"
                                    : "bg-white hover:bg-orange-100"
                                }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredMenus.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredMenus.map((item, index) => (
                            <MenuCard key={item._id} item={item} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-white">
                        <h3 className="text-xl font-semibold">No items found</h3>
                        <p className="text-white mt-2">
                            Try changing search or category
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All");
                            }}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FullMenu;
