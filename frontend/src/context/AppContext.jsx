import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/app";
import toast from "react-hot-toast";



export const AppContext = createContext();



export const AppContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [menus, setMenus] = useState([])

    const [menuItems, setMenuItems] = useState({})


    const fetchSeller = async () => {
        try {
            const { data } = await api.get('/api/seller/is-auth')
            if (data.success) {
                setIsSeller(true)
            }
            else {
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
            console.error(error.message)
        }
    }


    const fetchUser = async () => {
        try {
            const { data } = await api.get('api/users/is-auth');
            if (data.success) {
                setUser(data.user)
                setMenuItems(prev => Object.keys(prev).length > 0 ? prev : (data.user.menuItems || {})
                );
            }
        } catch (error) {
            setUser(null)
            console.error(error.message)
        }
    }


    const fetchMenus = async () => {
        try {
            const { data } = await api.get('/api/menu/list')
            if (data.success) {
                setMenus(data.menus)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const addToCart = (itemId) => {
        setMenuItems(prev => ({
            ...prev,
            [itemId]: (prev?.[itemId] || 0) + 1
        }));
        toast.success("Added to cart");
    };



    const updateCartItem = (itemId, quantity) => {
        setMenuItems(prev => {
            const copy = { ...prev }

            if (quantity <= 0) {
                delete copy[itemId]
            }
            else {
                copy[itemId] = quantity;
            }

            return copy;
        })
    }


    const removeFromCart = (itemId) => {
        setMenuItems(prev => {
            const copy = { ...prev }
            if (!copy[itemId]) return copy;

            copy[itemId] -= 1;
            if (copy[itemId] <= 0) delete copy[itemId];

            return copy;
        });
    };


    const getMenuCount = () => {
        let totalCount = 0;
        for (const item in menuItems) {
            totalCount += menuItems[item]
        }
        return totalCount;
    }

    const getMenuAmount = () => {
        let totalAmount = 0
        for (const itemId in menuItems) {
            const itemInfo = menus.find(menu => menu._id === itemId)

            if (!itemInfo) continue;

            totalAmount += itemInfo.price * menuItems[itemId]
        }
        return Math.round(totalAmount * 100) / 100
    }


    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchMenus()
    }, [])

    // Update Database Menu Items 
    useEffect(() => {

        if (!user || !menuItems || Object.keys(menuItems).length === 0) return;

        const updateMenu = async () => {
            try {
                const { data } = await api.post("/api/menu-items/update-menu", { menuItems });
                if (!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        updateMenu()
    }, [menuItems, user])


    const value = {
        showUserLogin, setShowUserLogin,
        isSeller, setIsSeller, fetchSeller,
        fetchUser, menus, fetchMenus,
        user, setUser,
        menuItems,
        setMenuItems,
        getMenuAmount,
        getMenuCount,
        removeFromCart,
        updateCartItem,
        addToCart
    }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}


export const useAppContext = () => {
    return useContext(AppContext)
}