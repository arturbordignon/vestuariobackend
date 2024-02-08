const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { errorHandler } = require("./utils/middleware");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB conectado com sucesso."))
  .catch((err) => console.error("Falha ao conectar com o MongoDB:", err));

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Vestuario",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", clothingRoutes);
app.use("/api", chatRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
