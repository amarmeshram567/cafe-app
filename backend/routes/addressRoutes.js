const express = require("express");
const { addAddress, getAddresses, deleteAddress } = require("../controllers/addressController");
const authUser = require("../middleware/authUser");

const addressRouter = express.Router();

addressRouter.post("/create", authUser, addAddress);
addressRouter.get("/get", authUser, getAddresses);
addressRouter.delete("/delete/:id", authUser, deleteAddress)


module.exports = addressRouter;