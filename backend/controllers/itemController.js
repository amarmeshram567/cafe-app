const User = require("../models/User");



// update user menu items : /api/users/update-menu
const updateMenu = async (req, res) => {
    try {

        const userId = req.user.userId;
        const { menuItems } = req.body;

        const user = await User.findByIdAndUpdate(userId, { menuItems }, { new: true });

        res.status(200).json({
            success: true,
            message: "Menu Updated",
            data: user.menuItems
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
    updateMenu
}