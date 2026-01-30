import { type User, type InsertUser, type Message, type InsertMessage, type Product, type InsertProduct, type ProductNotification, type InsertProductNotification, type Customization, type InsertCustomization, type CartItem, type InsertCartItem, type WishlistItem, type InsertWishlistItem, type ContactSubmission, type InsertContactSubmission } from "@shared/schema";
import { randomUUID } from "crypto";
import { hashPassword, isBcryptHash } from "./utils/password";
import { CONFIG } from "./config";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVisitorId(visitorId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMessages(visitorId: string): Promise<Message[]>;
  getAllConversations(): Promise<{ visitorId: string; lastMessage: Message; unreadCount: number; user?: { username: string; fullName: string; email: string } }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(visitorId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<boolean>;

  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  createNotification(notif: InsertProductNotification): Promise<ProductNotification>;
  createCustomization(cust: InsertCustomization): Promise<Customization>;

  getCartItems(visitorId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(itemId: string): Promise<boolean>;

  getWishlistItems(visitorId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(itemId: string): Promise<boolean>;
  isInWishlist(visitorId: string, productId: string): Promise<boolean>;

  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Admin stats
  getCustomerCount(): Promise<number>;
  getUnreadMessageCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;
  private products: Map<string, Product>;
  private notifications: Map<string, ProductNotification>;
  private customizations: Map<string, Customization>;
  private cartItems: Map<string, CartItem>;
  private wishlistItems: Map<string, WishlistItem>;
  private contactSubmissions: Map<string, ContactSubmission>;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.products = new Map();
    this.notifications = new Map();
    this.customizations = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.contactSubmissions = new Map();
    // Initialize admin user with hashed password
    this.initializeAdmin();
    // Migrate existing users to link them with their visitor IDs
    this.migrateUserVisitorIds();
  }

  private async initializeAdmin() {
    const adminPassword = CONFIG.admin.password;
    const hashedPassword = isBcryptHash(adminPassword)
      ? adminPassword
      : await hashPassword(adminPassword);

    this.users.set("admin-id", {
      id: "admin-id",
      email: CONFIG.admin.email,
      username: "Admin",
      fullName: "Administrator",
      password: hashedPassword,
      isAdmin: true,
      visitorId: null
    });
  }

  private async migrateUserVisitorIds() {
    // Link users to their visitor IDs based on message history
    const messagesArray = Array.from(this.messages.values());
    const userVisitorMap = new Map<string, string>();

    // Build a map of userId -> visitorId from messages
    for (const message of messagesArray) {
      if (message.userId && !message.isFromAdmin) {
        userVisitorMap.set(message.userId, message.visitorId);
      }
    }

    // Update users that don't have a visitorId set
    for (const [userId, visitorId] of userVisitorMap.entries()) {
      const user = this.users.get(userId);
      if (user && !user.visitorId) {
        this.users.set(userId, { ...user, visitorId });
        console.log(`[Migration] Linked user ${user.username} to visitor ${visitorId}`);
      }
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByVisitorId(visitorId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.visitorId === visitorId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await hashPassword(insertUser.password);
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      visitorId: insertUser.visitorId || null,
      isAdmin: false
    };
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

  async getAllConversations(): Promise<{ visitorId: string; lastMessage: Message; unreadCount: number; user?: { username: string; fullName: string; email: string } }[]> {
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

    const result: { visitorId: string; lastMessage: Message; unreadCount: number; user?: { username: string; fullName: string; email: string } }[] = [];
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
        // Try to find user associated with this visitor ID
        let user = await this.getUserByVisitorId(visitorId);

        // If no user found by visitorId, try to find by userId from messages
        if (!user) {
          const userMessage = data.messages.find(msg => msg.userId && !msg.isFromAdmin);
          if (userMessage?.userId) {
            user = this.users.get(userMessage.userId);
          }
        }

        result.push({
          visitorId,
          lastMessage: sorted[0],
          unreadCount: data.unreadCount,
          user: user ? { username: user.username, fullName: user.fullName, email: user.email } : undefined,
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

    // Auto-link user to visitorId if they don't have one yet
    if (message.userId && !message.isFromAdmin) {
      const user = this.users.get(message.userId);
      if (user && !user.visitorId) {
        this.users.set(message.userId, { ...user, visitorId: message.visitorId });
        console.log(`[Auto-link] Linked user ${user.username} to visitor ${message.visitorId}`);
      }
    }

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

  async deleteMessage(messageId: string): Promise<boolean> {
    return this.messages.delete(messageId);
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
      bestSeller: insertProduct.bestSeller ?? false,
      newArrival: insertProduct.newArrival ?? false,
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

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;

    const updatedProduct: Product = {
      ...insertProduct,
      id,
      featured: insertProduct.featured ?? false,
      bestSeller: insertProduct.bestSeller ?? false,
      newArrival: insertProduct.newArrival ?? false,
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
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
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

  async getCartItems(visitorId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter((item) => item.visitorId === visitorId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { ...insertItem, id, createdAt: new Date() };
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(itemId: string): Promise<boolean> {
    return this.cartItems.delete(itemId);
  }

  async getWishlistItems(visitorId: string): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values())
      .filter((item) => item.visitorId === visitorId);
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = randomUUID();
    const item: WishlistItem = { ...insertItem, id, createdAt: new Date() };
    this.wishlistItems.set(id, item);
    return item;
  }

  async removeFromWishlist(itemId: string): Promise<boolean> {
    return this.wishlistItems.delete(itemId);
  }

  async isInWishlist(visitorId: string, productId: string): Promise<boolean> {
    return Array.from(this.wishlistItems.values()).some(
      (item) => item.visitorId === visitorId && item.productId === productId
    );
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = { ...insertSubmission, id, createdAt: new Date() };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCustomerCount(): Promise<number> {
    return Array.from(this.users.values()).filter(user => !user.isAdmin).length;
  }

  async getUnreadMessageCount(): Promise<number> {
    return Array.from(this.messages.values()).filter(msg => !msg.read && !msg.isFromAdmin).length;
  }
}

// Import DatabaseStorage
import { DatabaseStorage } from './db-storage';

// Use DatabaseStorage if USE_DATABASE is true, otherwise use MemStorage
const useDatabase = process.env.USE_DATABASE === 'true';
export const storage: IStorage = useDatabase ? new DatabaseStorage() : new MemStorage();
