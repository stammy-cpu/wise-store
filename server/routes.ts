import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertProductSchema, insertProductNotificationSchema, insertCustomizationSchema, insertUserSchema, insertCartItemSchema, insertWishlistItemSchema } from "@shared/schema";
import { requireAuth, requireAdmin, type AuthRequest } from "./middleware/auth";
import { loginRateLimiter } from "./middleware/rateLimit";
import { messageRateLimit } from "./middleware/messageRateLimit";
import { verifyPassword } from "./utils/password";
import { upload } from "./upload";
import { uploadToStorage } from "./supabase";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ===== Authentication Routes =====

  // Login with rate limiting and bcrypt verification
  app.post("/api/login", loginRateLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await storage.getUserByEmail(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password with bcrypt
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.fullName = user.fullName;
    req.session.isAdmin = user.isAdmin || false;

    // Save session explicitly before sending response (important for cross-domain)
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session save failed" });
      }

      // Return user data (excluding password)
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
      });
    });
  });

  // Register new user
  app.post("/api/register", loginRateLimiter, async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid user data" });
      }

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(parsed.data.email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Create the user
      const user = await storage.createUser(parsed.data);

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.fullName = user.fullName;
      req.session.isAdmin = user.isAdmin || false;

      // Save session explicitly before sending response (important for cross-domain)
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Session save failed" });
        }

        // Return user data (excluding password)
        res.status(201).json({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('wise.sid');
      res.json({ success: true });
    });
  });

  // Check current session
  app.get("/api/auth/session", (req, res) => {
    if (req.session?.userId) {
      res.json({
        id: req.session.userId,
        username: req.session.username,
        isAdmin: req.session.isAdmin || false,
      });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // ===== Upload Routes =====

  // Upload images to Supabase Storage (admin only)
  app.post("/api/upload", requireAdmin, upload.array('images', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Upload each file to Supabase Storage
      const uploadPromises = req.files.map(async (file) => {
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1E9);
        const filename = `${timestamp}-${randomSuffix}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`;
        const path = `products/${filename}`;

        // Upload to Supabase Storage
        const publicUrl = await uploadToStorage(
          'product-images',
          path,
          file.buffer,
          file.mimetype
        );

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      res.json({ urls });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message || "Failed to upload images" });
    }
  });

  // ===== Public Routes =====

  // Public visitor messaging endpoints (no auth required)
  app.get("/api/visitor/messages/:visitorId", async (req, res) => {
    try {
      const { visitorId } = req.params;
      if (!visitorId) {
        return res.status(400).json({ error: "Visitor ID required" });
      }
      const messages = await storage.getMessages(visitorId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/visitor/messages", messageRateLimit, async (req, res) => {
    try {
      const { visitorId, content } = req.body;

      if (!visitorId || !content) {
        return res.status(400).json({ error: "Visitor ID and content required" });
      }

      // Content validation: prevent spam
      if (content.trim().length < 1 || content.length > 1000) {
        return res.status(400).json({ error: "Message must be between 1 and 1000 characters" });
      }

      const message = await storage.createMessage({
        visitorId,
        content: content.trim(),
        isFromAdmin: false,
        userId: null,
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get best sellers (public) - must come before /api/products/:id
  app.get("/api/products/bestsellers", async (_req, res) => {
    try {
      const bestSellers = await storage.getBestSellers();
      res.json(bestSellers);
    } catch (error: any) {
      console.error('[API] Best sellers error:', error);
      res.status(500).json({ error: "Failed to fetch best sellers", details: error.message });
    }
  });

  // Get trending products (public) - must come before /api/products/:id
  app.get("/api/products/trending", async (_req, res) => {
    try {
      const trending = await storage.getTrending();
      res.json(trending);
    } catch (error: any) {
      console.error('[API] Trending products error:', error);
      res.status(500).json({ error: "Failed to fetch trending products", details: error.message });
    }
  });

  // Get products (public)
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product (public)
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Public notification signup
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

  // Public customization request
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

  // ===== Cart Routes =====

  // Get cart items (public, uses visitorId)
  app.get("/api/cart/:visitorId", async (req, res) => {
    try {
      const { visitorId } = req.params;
      if (!visitorId) {
        return res.status(400).json({ error: "Visitor ID required" });
      }
      const items = await storage.getCartItems(visitorId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  // Add item to cart (public)
  app.post("/api/cart", async (req, res) => {
    try {
      const parsed = insertCartItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid cart item data" });
      }
      const item = await storage.addToCart(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  // Remove item from cart (public)
  app.delete("/api/cart/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const deleted = await storage.removeFromCart(itemId);
      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  // ===== Wishlist Routes =====

  // Get wishlist items (public, uses visitorId)
  app.get("/api/wishlist/:visitorId", async (req, res) => {
    try {
      const { visitorId } = req.params;
      if (!visitorId) {
        return res.status(400).json({ error: "Visitor ID required" });
      }
      const items = await storage.getWishlistItems(visitorId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist items" });
    }
  });

  // Check if product is in wishlist (public)
  app.get("/api/wishlist/:visitorId/:productId", async (req, res) => {
    try {
      const { visitorId, productId } = req.params;
      const isInWishlist = await storage.isInWishlist(visitorId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      res.status(500).json({ error: "Failed to check wishlist" });
    }
  });

  // Add item to wishlist (public)
  app.post("/api/wishlist", async (req, res) => {
    try {
      const parsed = insertWishlistItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid wishlist item data" });
      }
      const item = await storage.addToWishlist(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to wishlist" });
    }
  });

  // Remove item from wishlist (public)
  app.delete("/api/wishlist/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const deleted = await storage.removeFromWishlist(itemId);
      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from wishlist" });
    }
  });

  // ===== Order Routes =====

  // Get user orders (requires authentication)
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const visitorId = req.session.visitorId || "";
      const orders = await storage.getUserOrders(userId, visitorId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Create new order (requires authentication)
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const visitorId = req.session.visitorId || req.body.visitorId;

      const orderData = {
        ...req.body,
        userId,
        visitorId,
      };

      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // ===== Admin-Only Routes =====

  // Get all conversations (admin only)
  app.get("/api/conversations", requireAdmin, async (_req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get admin stats (admin only)
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const [customerCount, unreadMessageCount] = await Promise.all([
        storage.getCustomerCount(),
        storage.getUnreadMessageCount()
      ]);

      res.json({
        customers: customerCount,
        messages: unreadMessageCount,
        orders: 0, // TODO: Implement when orders table is added
        revenue: 0 // TODO: Implement when orders table is added
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  // Mark messages as read (admin only)
  app.post("/api/messages/:visitorId/read", requireAdmin, async (req, res) => {
    try {
      const { visitorId } = req.params;
      await storage.markMessagesAsRead(visitorId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  // Delete message (admin only)
  app.delete("/api/messages/:messageId", requireAdmin, async (req, res) => {
    try {
      const { messageId } = req.params;
      const deleted = await storage.deleteMessage(messageId);

      if (!deleted) {
        return res.status(404).json({ error: "Message not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Create product (admin only)
  app.post("/api/products", requireAdmin, async (req, res) => {
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

  // Update product (admin only)
  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid product data" });
      }
      const product = await storage.updateProduct(id, parsed.data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete product (admin only)
  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Contact form submission (public)
  app.post("/api/contact", async (req, res) => {
    try {
      const { insertContactSubmissionSchema } = await import("@shared/schema");
      const parsed = insertContactSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid contact form data" });
      }
      const submission = await storage.createContactSubmission(parsed.data);

      // In production, you would send an email here
      // For now, we just store it and log it
      log.info(`New contact submission from ${parsed.data.email}: ${parsed.data.message}`);

      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      log.error("Failed to process contact submission:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get contact submissions (admin only)
  app.get("/api/contact", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  // ===== Authenticated Routes =====

  // Get messages (authenticated users only)
  app.get("/api/messages/:visitorId", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    const { visitorId } = req.params;

    // Users can only access their own visitor messages, admins can access all
    if (!authReq.isAdmin) {
      const user = await storage.getUser(authReq.userId!);
      if (user?.visitorId !== visitorId) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    try {
      const messages = await storage.getMessages(visitorId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Post message (authenticated users only)
  app.post("/api/messages", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;

    try {
      const parsed = insertMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid message data" });
      }

      // Ensure userId matches session
      const messageData = {
        ...parsed.data,
        userId: authReq.userId!,
        isFromAdmin: authReq.isAdmin || false,
      };

      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  return httpServer;
}
