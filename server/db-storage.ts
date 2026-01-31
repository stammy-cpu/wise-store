import type { User, InsertUser, Message, InsertMessage, Product, InsertProduct, ProductNotification, InsertProductNotification, Customization, InsertCustomization, CartItem, InsertCartItem, WishlistItem, InsertWishlistItem, ContactSubmission, InsertContactSubmission, Order, InsertOrder } from "@shared/schema";
import { users, messages, products, productNotifications, customizations, cartItems, wishlistItems, contactSubmissions, orders } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import type { IStorage } from "./storage";
import { hashPassword, isBcryptHash } from "./utils/password";
import { CONFIG } from "./config";

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeAdmin();
  }

  private async initializeAdmin() {
    try {
      // Check if admin already exists
      const existingAdmin = await db
        .select()
        .from(users)
        .where(eq(users.email, CONFIG.admin.email))
        .limit(1);

      if (existingAdmin.length > 0) {
        console.log('[Database] Admin user already exists');
        return;
      }

      // Create admin user
      const adminPassword = CONFIG.admin.password;
      const hashedPassword = isBcryptHash(adminPassword)
        ? adminPassword
        : await hashPassword(adminPassword);

      await db.insert(users).values({
        email: CONFIG.admin.email,
        username: "Admin",
        fullName: "Administrator",
        password: hashedPassword,
        isAdmin: true,
        visitorId: null,
      });

      console.log('[Database] Admin user created successfully');
    } catch (error) {
      console.error('[Database] Error initializing admin:', error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByVisitorId(visitorId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.visitorId, visitorId)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(insertUser.password);
    const result = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        isAdmin: false,
      })
      .returning();
    return result[0];
  }

  async getMessages(visitorId: string): Promise<Message[]> {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.visitorId, visitorId))
      .orderBy(messages.createdAt);
    return result;
  }

  async getAllConversations(): Promise<{ visitorId: string; lastMessage: Message; unreadCount: number; user?: { username: string; fullName: string; email: string } }[]> {
    // Get all messages grouped by visitorId
    const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));

    // Group by visitorId
    const conversationMap = new Map<string, { messages: Message[]; unreadCount: number }>();

    for (const msg of allMessages) {
      if (!conversationMap.has(msg.visitorId)) {
        conversationMap.set(msg.visitorId, { messages: [], unreadCount: 0 });
      }
      const conv = conversationMap.get(msg.visitorId)!;
      conv.messages.push(msg);
      if (!msg.read && !msg.isFromAdmin) {
        conv.unreadCount++;
      }
    }

    // Build result array
    const result: { visitorId: string; lastMessage: Message; unreadCount: number; user?: { username: string; fullName: string; email: string } }[] = [];

    for (const [visitorId, data] of conversationMap.entries()) {
      if (data.messages.length > 0) {
        const sorted = data.messages.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        // Try to find user associated with this visitor ID
        let user = await this.getUserByVisitorId(visitorId);

        // If no user found by visitorId, try to find by userId from messages
        if (!user) {
          const userMessage = data.messages.find(msg => msg.userId && !msg.isFromAdmin);
          if (userMessage?.userId) {
            user = await this.getUser(userMessage.userId);
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
    const result = await db
      .insert(messages)
      .values({
        ...insertMessage,
        read: false,
      })
      .returning();

    const message = result[0];

    // Auto-link user to visitorId if they don't have one yet
    if (message.userId && !message.isFromAdmin) {
      const user = await this.getUser(message.userId);
      if (user && !user.visitorId) {
        await db
          .update(users)
          .set({ visitorId: message.visitorId })
          .where(eq(users.id, message.userId));
        console.log(`[Auto-link] Linked user ${user.username} to visitor ${message.visitorId}`);
      }
    }

    return message;
  }

  async markMessagesAsRead(visitorId: string): Promise<void> {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.visitorId, visitorId), eq(messages.isFromAdmin, false)));
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, messageId)).returning();
    return result.length > 0;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async createNotification(insertNotif: InsertProductNotification): Promise<ProductNotification> {
    const result = await db.insert(productNotifications).values(insertNotif).returning();
    return result[0];
  }

  async createCustomization(insertCust: InsertCustomization): Promise<Customization> {
    const result = await db.insert(customizations).values(insertCust).returning();
    return result[0];
  }

  async getCartItems(visitorId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.visitorId, visitorId));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(insertItem).returning();
    return result[0];
  }

  async removeFromCart(itemId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, itemId)).returning();
    return result.length > 0;
  }

  async getWishlistItems(visitorId: string): Promise<WishlistItem[]> {
    return await db.select().from(wishlistItems).where(eq(wishlistItems.visitorId, visitorId));
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const result = await db.insert(wishlistItems).values(insertItem).returning();
    return result[0];
  }

  async removeFromWishlist(itemId: string): Promise<boolean> {
    const result = await db.delete(wishlistItems).where(eq(wishlistItems.id, itemId)).returning();
    return result.length > 0;
  }

  async isInWishlist(visitorId: string, productId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.visitorId, visitorId), eq(wishlistItems.productId, productId)))
      .limit(1);
    return result.length > 0;
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async getCustomerCount(): Promise<number> {
    const result = await db.select().from(users).where(eq(users.isAdmin, false));
    return result.length;
  }

  async getUnreadMessageCount(): Promise<number> {
    const result = await db.select().from(messages).where(and(eq(messages.read, false), eq(messages.isFromAdmin, false)));
    return result.length;
  }

  // Order methods
  async getUserOrders(userId: string, visitorId: string): Promise<Order[]> {
    const userIdResults = userId
      ? await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
      : [];
    const visitorIdResults = await db.select().from(orders).where(eq(orders.visitorId, visitorId)).orderBy(desc(orders.createdAt));

    // Merge and deduplicate
    const allOrders = [...userIdResults, ...visitorIdResults];
    const uniqueOrders = Array.from(new Map(allOrders.map(order => [order.id, order])).values());
    return uniqueOrders.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    return result[0];
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const result = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
