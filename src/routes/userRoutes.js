const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/users/register", userController.register);

router.post("/users/login", userController.login);

router.post("/users/forgot-password", userController.forgotPassword);

router.post("/users/reset-password", userController.resetPassword);

module.exports = router;
