import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertProductSchema, insertProductNotificationSchema, insertCustomizationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/messages/:visitorId", async (req, res) => {
    try {
      const { visitorId } = req.params;
      const messages = await storage.getMessages(visitorId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (user && user.password === password) {
      res.json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/conversations", async (_req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid message data" });
      }
      
      // If not from admin, verify if they are logged in or if we allow anonymous
      // User requested: "only registered and logged in regular users are able to send messages"
      if (!parsed.data.isFromAdmin && !parsed.data.userId) {
        return res.status(401).json({ error: "Authentication required to send messages" });
      }

      const message = await storage.createMessage(parsed.data);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid product data" });
      }
      const product = await storage.createProduct(parsed.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const parsed = insertProductNotificationSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid notification data" });
      const notif = await storage.createNotification(parsed.data);
      res.status(201).json(notif);
    } catch (error) {
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.post("/api/customizations", async (req, res) => {
    try {
      const parsed = insertCustomizationSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid customization data" });
      const customization = await storage.createCustomization(parsed.data);
      res.status(201).json(customization);
    } catch (error) {
      res.status(500).json({ error: "Failed to create customization" });
    }
  });

  app.post("/api/messages/:visitorId/read", async (req, res) => {
    try {
      const { visitorId } = req.params;
      await storage.markMessagesAsRead(visitorId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  return httpServer;
}
