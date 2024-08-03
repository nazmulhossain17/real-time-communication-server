import prisma from "../../../shared/prisma";

export const MessageService = {
  sendMessage: async (
    senderId: string,
    receiverId: string,
    message: string
  ) => {
    if (!senderId || !receiverId || !message) {
      throw new Error("Invalid input parameters");
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { id: { in: [senderId, receiverId] } },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: senderId }, { id: receiverId }],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        message,
        senderId,
        receiverId,
        conversationId: conversation.id,
      },
    });

    return newMessage;
  },

  getMessages: async (senderId: string, userToChatId: string) => {
    if (!senderId || !userToChatId) {
      throw new Error("Invalid input parameters");
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { id: { in: [senderId, userToChatId] } },
        },
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      return [];
    }

    return conversation.messages;
  },
};
