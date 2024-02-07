const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../utils/middleware");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Vestuario",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

const upload = multer({ storage: storage });

router.post("/admin/login", adminController.login);

router.post("/admin/forgot-password", adminController.forgotPassword);

router.post("/admin/reset-password", adminController.resetPassword);

router.get("/admin/clothes", authenticateToken, adminController.getAllClothingForAdmin);

router.post(
  "/admin/clothing/add",
  upload.single("image"),
  authenticateToken,
  adminController.addClothing
);

router.put(
  "/admin/clothing/:id",
  authenticateToken,
  upload.single("image"),
  adminController.updateClothing
);

router.delete("/admin/clothing/:id", authenticateToken, adminController.deleteClothing);

router.put("/admin/clothing/:clothingId/donated", authenticateToken, adminController.markAsDonated);

router.get("/admin/clothing/donated", authenticateToken, adminController.getDonatedClothing);

router.post("/admin/add-admin", authenticateToken, adminController.addAdmin);

router.post("/admin/reset-password", adminController.resetPassword);

router.delete("/admin/delete/:adminId", authenticateToken, adminController.deleteAdmin);

router.get("/admin/all", authenticateToken, adminController.getAllAdmins);

module.exports = router;
