const express = require('express');
const { getMenuItems, addMenuItem, getMenuById, changeMenuItemAvailability } = require('../controllers/menuController');
const upload = require('../config/multer');
const authSeller = require('../middleware/authSeller');

const menuRouter = express.Router();


menuRouter.post("/add", authSeller, upload.single("image"), addMenuItem)
menuRouter.get("/list", getMenuItems);
menuRouter.get("/:id", getMenuById);
menuRouter.post("/change-availability", authSeller, changeMenuItemAvailability);


module.exports = menuRouter;

