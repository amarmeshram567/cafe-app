const express = require('express');
const { updateMenu } = require('../controllers/itemController');
const authUser = require('../middleware/authUser');


const menuItemRouter = express.Router();

menuItemRouter.post("/update-menu", authUser, updateMenu);


module.exports = menuItemRouter;