import { type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMessages(visitorId: string): Promise<Message[]>;
  getAllConversations(): Promise<{ visitorId: string; lastMessage: Message; unreadCount: number }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(visitorId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, visitorId: null, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async getMessages(visitorId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.visitorId === visitorId)
      .sort((a: Message, b: Message) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
  }

  async getAllConversations(): Promise<{ visitorId: string; lastMessage: Message; unreadCount: number }[]> {
    const messagesArray = Array.from(this.messages.values());
    const conversationMap = new Map<string, { messages: Message[]; unreadCount: number }>();

    for (const msg of messagesArray) {
      if (!conversationMap.has(msg.visitorId)) {
        conversationMap.set(msg.visitorId, { messages: [], unreadCount: 0 });
      }
      const conv = conversationMap.get(msg.visitorId)!;
      conv.messages.push(msg);
      if (!msg.read && !msg.isFromAdmin) {
        conv.unreadCount++;
      }
    }

    const result: { visitorId: string; lastMessage: Message; unreadCount: number }[] = [];
    const entries = Array.from(conversationMap.entries());
    for (const entry of entries) {
      const visitorId = entry[0];
      const data = entry[1];
      const sorted = data.messages.sort((a: Message, b: Message) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      if (sorted.length > 0) {
        result.push({
          visitorId,
          lastMessage: sorted[0],
          unreadCount: data.unreadCount,
        });
      }
    }

    return result.sort((a, b) => {
      const dateA = a.lastMessage.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const dateB = b.lastMessage.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      read: false,
      isFromAdmin: insertMessage.isFromAdmin ?? false,
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(visitorId: string): Promise<void> {
    const entries = Array.from(this.messages.entries());
    for (const entry of entries) {
      const id = entry[0];
      const msg = entry[1];
      if (msg.visitorId === visitorId && !msg.isFromAdmin) {
        this.messages.set(id, { ...msg, read: true });
      }
    }
  }
}

export const storage = new MemStorage();
