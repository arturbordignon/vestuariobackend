const Clothing = require("../models/Clothing");
const { errorResponse, successResponse } = require("../utils/responseHelpers");

const clothingController = {
  getAllClothing: async (req, res) => {
    try {
      const clothingItems = await Clothing.find();
      res.send(clothingItems);
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  getClothingById: async (req, res) => {
    try {
      const clothing = await Clothing.findById(req.params.id);
      if (!clothing) return res.status(404).send(errorResponse("Roupa não encontrada"));
      res.send(clothing);
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  getClothingBySeason: async (req, res) => {
    try {
      const season = req.params.season;
      const clothingItems = await Clothing.find({ season: season });
      res.send(successResponse(clothingItems));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },
  getDonatedClothing: async (req, res) => {
    try {
      const donatedClothingItems = await Clothing.find({ status: "doada" });
      res.json({ success: true, data: donatedClothingItems });
    } catch (error) {
      console.error("Erro ao buscar roupas doadas:", error);
      res.status(500).json({ success: false, message: "Erro Interno" });
    }
  },
};

module.exports = clothingController;
