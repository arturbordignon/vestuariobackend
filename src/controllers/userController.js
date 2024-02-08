const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse, successResponse } = require("../utils/responseHelpers");
require("dotenv").config();

const userController = {
  register: async (req, res) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const user = new User({
        cpf: req.body.cpf,
        name: req.body.name,
        email: req.body.email,
        passwordHash: hashedPassword,
      });

      await user.save();
      res.status(201).send(successResponse("Usuário criado com sucesso"));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user._id || !bcrypt.compare(req.body.password, user.passwordHash)) {
        return res.status(400).json({ error: "Email ou senha inválidos" });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send(successResponse({ token, userId: user._id }));
    } catch (error) {
      res.status(500).send(errorResponse(error.message));
    }
  },
};

module.exports = userController;
