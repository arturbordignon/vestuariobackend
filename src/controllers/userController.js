const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse, successResponse } = require("../utils/responseHelpers");
require("dotenv").config();
const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);

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

  forgotPassword: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send(errorResponse("Usuário não encontrado"));
      }

      const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "3663628@alunouninter.com",
              Name: "Vestuario",
            },
            To: [
              {
                Email: user.email,
                Name: user.name,
              },
            ],
            Subject: "Redefinir sua senha",
            TextPart: "Clique no link a seguir para redefinir sua senha",
            HTMLPart: `<p>Clique no link a seguir para redefinir sua senha:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
            CustomID: "AppGettingStartedTest",
          },
        ],
      });

      await request;

      res.send(successResponse("Email enviado com sucesso"));
    } catch (error) {
      console.error("Erro: ", error);
      res.status(500).send(errorResponse(error.message));
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send(errorResponse("Usuário não encontrado"));
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      user.passwordHash = hashedPassword;
      await user.save();

      res.send(successResponse("Senha redefinida com sucesso"));
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(400).send(errorResponse("Token inválido ou expirado"));
      }
      res.status(500).send(errorResponse(error.message));
    }
  },
};

module.exports = userController;
