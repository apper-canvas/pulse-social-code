import chatsData from '@/services/mockData/chats.json';
import messagesData from '@/services/mockData/messages.json';

let chats = [...chatsData];
let messages = [...messagesData];
let nextChatId = Math.max(...chats.map(c => c.Id)) + 1;
let nextMessageId = Math.max(...messages.map(m => m.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const chatService = {
  async getAll() {
    await delay(300);
    return [...chats];
  },

  async getById(id) {
    await delay(200);
    const chat = chats.find(c => c.Id === id);
    return chat ? { ...chat } : null;
  },

  async getMessages(chatId) {
    await delay(250);
    const chatMessages = messages.filter(m => m.chatId === chatId);
    return chatMessages.map(m => ({ ...m }));
  },

  async sendMessage(messageData) {
    await delay(300);
    const newMessage = {
      Id: nextMessageId++,
      chatId: messageData.chatId,
      senderId: messageData.senderId,
      content: messageData.content,
      type: messageData.type || 'text',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    messages.push(newMessage);
    return { ...newMessage };
  },

  async markAsRead(chatId) {
    await delay(100);
    messages = messages.map(m => 
      m.chatId === chatId ? { ...m, isRead: true } : m
    );
    return true;
  },

  async create(chatData) {
    await delay(300);
    const newChat = {
      Id: nextChatId++,
      participants: chatData.participants,
      lastMessage: null,
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };
    
    chats.push(newChat);
    return { ...newChat };
  },

  async update(id, updateData) {
    await delay(250);
    const chatIndex = chats.findIndex(c => c.Id === id);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }
    
    chats[chatIndex] = { ...chats[chatIndex], ...updateData };
    return { ...chats[chatIndex] };
  },

  async delete(id) {
    await delay(200);
    const chatIndex = chats.findIndex(c => c.Id === id);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }
    
    chats.splice(chatIndex, 1);
    // Also remove associated messages
    messages = messages.filter(m => m.chatId !== id);
    return true;
  }
};