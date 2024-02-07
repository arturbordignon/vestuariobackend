const express = require("express");
const router = express.Router();
const clothingController = require("../controllers/clothingController");
const { authenticateUserToken } = require("../utils/userAuthMiddleware");

router.get("/user/clothes", clothingController.getAllClothing);

router.get("/user/:id", clothingController.getClothingById);

router.get("/user/season/:season", clothingController.getClothingBySeason);

router.get("/user/clothing/donated", authenticateUserToken, clothingController.getDonatedClothing);

module.exports = router;
