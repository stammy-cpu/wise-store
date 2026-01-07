import { type User, type InsertUser, type Message, type InsertMessage, type Product, type InsertProduct, type ProductNotification, type InsertProductNotification, type Customization, type InsertCustomization } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMessages(visitorId: string): Promise<Message[]>;
  getAllConversations(): Promise<{ visitorId: string; lastMessage: Message; unreadCount: number }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(visitorId: string): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  createNotification(notif: InsertProductNotification): Promise<ProductNotification>;
  createCustomization(cust: InsertCustomization): Promise<Customization>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;
  private products: Map<string, Product>;
  private notifications: Map<string, ProductNotification>;
  private customizations: Map<string, Customization>;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.products = new Map();
    this.notifications = new Map();
    this.customizations = new Map();
    // Seed admin user
    this.users.set("admin-id", {
      id: "admin-id",
      username: "fatahstammy@gmail.com",
      password: "@21Savage",
      isAdmin: true,
      visitorId: null
    });
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
      userId: insertMessage.userId ?? null,
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

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      featured: insertProduct.featured ?? false,
      isUpcoming: insertProduct.isUpcoming ?? false,
      dropDate: insertProduct.dropDate ?? null,
      allowCustomization: insertProduct.allowCustomization ?? false,
      videos: insertProduct.videos ?? null,
      sizes: insertProduct.sizes ?? null,
      colors: insertProduct.colors ?? null,
      type: insertProduct.type ?? null,
      category: insertProduct.category ?? null,
      sex: insertProduct.sex ?? null
    };
    this.products.set(id, product);
    return product;
  }

  async createNotification(insertNotif: InsertProductNotification): Promise<ProductNotification> {
    const id = randomUUID();
    const notif: ProductNotification = { ...insertNotif, id, createdAt: new Date() };
    this.notifications.set(id, notif);
    return notif;
  }

  async createCustomization(insertCust: InsertCustomization): Promise<Customization> {
    const id = randomUUID();
    const cust: Customization = { ...insertCust, id, createdAt: new Date(), status: "pending" };
    this.customizations.set(id, cust);
    return cust;
  }
}

export const storage = new MemStorage();
