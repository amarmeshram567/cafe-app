const MenuItem = require("../models/MenuItems");

const cloudinary = require("../config/cloudinary")


// add menu item : /api/menu/add
const addMenuItem = async (req, res) => {
    try {
        let menuData = JSON.parse(req.body.menuData);

        if (Array.isArray(menuData.description)) {
            menuData.description = menuData.description.join("")
        }

        const image = req.file;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }

        // Upload images to cloudinary
        const result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
        })


        const menu = await MenuItem.create({
            ...menuData,
            imageUrl: result.secure_url,
        })

        res.status(201).json({
            success: true,
            message: "Menu Item added successfully",
            menu
        })

    } catch (error) {
        console.error("Error in addMenuItem controller:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// Get Menu Items: /api/menu/list
const getMenuItems = async (req, res) => {
    try {

        const menuItems = await MenuItem.find({});

        res.status(200).json({
            success: true,
            message: "Menu Items fetched successfully",
            menus: menuItems
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// Get Single Menu Item: /api/menu/:id
const getMenuById = async (req, res) => {
    try {

        const { id } = req.params;

        const menuItem = await MenuItem.findById(id);

        res.status(200).json({
            success: true,
            message: "Menu Item fetched successfully",
            data: menuItem
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// Change Menu Item Availability: /api/menu/change-availability
const changeMenuItemAvailability = async (req, res) => {
    try {

        const { id, isAvailable } = req.body;

        const menuItem = await MenuItem.findByIdAndUpdate(id, { isAvailable }, { new: true });

        res.status(200).json({
            success: true,
            message: "Menu Item availability updated successfully",
            data: menuItem
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


module.exports = {
    addMenuItem,
    getMenuItems,
    getMenuById,
    changeMenuItemAvailability
}