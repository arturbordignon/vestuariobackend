const Chat = require("../models/Chat");

const chatController = {
  startOrContinueChat: async (req, res) => {
    try {
      const { userId, clothingId } = req.body;

      let chat = await Chat.findOne({ user: userId, clothing: clothingId });

      if (!chat) {
        chat = new Chat({
          user: userId,
          clothing: clothingId,
          messages: [],
        });
        await chat.save();
      }

      res.status(200).json({
        success: true,
        chatId: chat._id,
        message: "Chat criado ou continuado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao criar o chat:", error);
      res.status(500).json({ success: false, message: "Erro Interno", error: error.message });
    }
  },

  getChats: async (req, res) => {
    try {
      let query = {};
      if (req.query.role === "user") {
        query.user = req.user._id;
      } else if (req.query.role === "admin") {
        query.admin = req.user._id;
      }

      const chats = await Chat.find(query)
        .populate("user admin")
        .populate("clothing", "title image")
        .populate("messages")
        .exec();

      res.json({ success: true, chats });
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao buscar conversas", error: error.message });
    }
  },

  getChatsForAdmin: async (req, res) => {
    try {
      const chats = await Chat.find({})
        .populate("user admin", "name email")
        .populate({
          path: "clothing",
          select: "title image",
        })
        .populate("messages", "content timestamp senderRole")
        .exec();

      res.json({ success: true, chats });
    } catch (error) {
      console.error("Erro ao buscar chats para admin:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao buscar chats para admin", error: error.message });
    }
  },

  getMessagesForAdminChat: async (req, res) => {
    try {
      const { chatId } = req.params;
      const chat = await Chat.findById(chatId).populate("messages").populate({
        path: "messages.sender",
        select: "name email",
      });

      if (!chat) {
        return res.status(404).json({ success: false, message: "Chat não encontrado" });
      }

      res.json({ success: true, messages: chat.messages });
    } catch (error) {
      console.error("Erro ao buscar mensagens para admin:", error);
      res.status(500).json({ success: false, message: "Erro Interno", error: error.message });
    }
  },

  addMessage: async (req, res) => {
    try {
      const { senderId, senderRole, content } = req.body;
      const { chatId } = req.params;

      const chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ success: false, message: "Chat não encontrado" });

      if (!["user", "admin"].includes(senderRole)) {
        return res.status(400).json({ success: false, message: "Cargo Inválido" });
      }

      chat.messages.push({
        sender: senderId,
        senderRole: senderRole,
        content: content,
        timestamp: new Date(),
      });
      await chat.save();

      res.status(200).json({ success: true, message: "Mensagem enviada com sucesso", chat });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Erro ao adicionar mensagem", error: error.message });
    }
  },

  sendMessageForAdmin: async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderRole = "admin";

    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ success: false, message: "Chat não encontrado" });

      const message = {
        sender: req.user._id,
        senderRole,
        content,
        timestamp: new Date(),
      };

      chat.messages.push(message);
      await chat.save();

      res.json({ success: true, message: "Mensagem enviada com sucesso", data: message });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      res.status(500).json({ success: false, message: "Erro Interno", error: error.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;

      const chat = await Chat.findById(chatId).populate("messages");
      if (!chat) {
        return res.status(404).json({ success: false, message: "Chat não encontrado" });
      }

      res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      res.status(500).json({ success: false, message: "Erro interno", error: error.message });
    }
  },

  deleteOrUpdateChatsForClothing: async (clothingId, action = "delete") => {
    try {
      if (action === "delete") {
        await Chat.deleteMany({ clothing: clothingId });
      } else if (action === "update") {
        await Chat.updateMany({ clothing: clothingId }, { $set: { clothingDonated: true } });
      }
    } catch (error) {
      console.error("Erro ao atualizar ou excluir conversas:", error);
      throw new Error("Erro ao atualizar ou excluir conversas para as roupas");
    }
  },
};

module.exports = chatController;
