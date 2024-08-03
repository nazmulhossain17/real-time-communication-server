import { Request, Response } from "express";
import { MessageService } from "./message.services";

export const MessageController = {
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { message, senderId } = req.body;
      const { id: receiverId } = req.params;

      if (!senderId) {
        return res.status(401).json({ error: "Unauthorized - No User ID" });
      }

      if (!message || !receiverId) {
        return res
          .status(400)
          .json({ error: "Bad Request - Missing parameters" });
      }

      const newMessage = await MessageService.sendMessage(
        senderId,
        receiverId,
        message
      );
      return res.status(201).json({ message: "Message sent", newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMessages: async (req: Request, res: Response) => {
    try {
      const { id: userToChatId } = req.params;
      const { senderId } = req.query;

      if (!senderId) {
        return res.status(401).json({ error: "Unauthorized - No User ID" });
      }

      const messages = await MessageService.getMessages(
        senderId as string,
        userToChatId
      );
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error retrieving messages:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
