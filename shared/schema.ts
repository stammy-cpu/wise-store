import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  fullName: text("full_name").notNull(),
  visitorId: text("visitor_id").unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  fullName: true,
  password: true,
  visitorId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  images: text("images").array().notNull(),
  videos: text("videos").array(),
  sizes: text("sizes").array(),
  colors: text("colors").array(),
  type: text("type"),
  category: text("category"),
  sex: text("sex"),
  featured: boolean("featured").default(false),
  bestSeller: boolean("best_seller").default(false),
  newArrival: boolean("new_arrival").default(false),
  isUpcoming: boolean("is_upcoming").default(false),
  dropDate: timestamp("drop_date"),
  allowCustomization: boolean("allow_customization").default(false),
});

export const productNotifications = pgTable("product_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").notNull(),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customizations = pgTable("customizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").notNull(),
  userId: text("user_id").notNull(),
  details: text("details").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertProductNotificationSchema = createInsertSchema(productNotifications).omit({ id: true });
export const insertCustomizationSchema = createInsertSchema(customizations).omit({ id: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type ProductNotification = typeof productNotifications.$inferSelect;
export type InsertProductNotification = z.infer<typeof insertProductNotificationSchema>;
export type Customization = typeof customizations.$inferSelect;
export type InsertCustomization = z.infer<typeof insertCustomizationSchema>;

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  visitorId: text("visitor_id").notNull(),
  content: text("content").notNull(),
  isFromAdmin: boolean("is_from_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  visitorId: true,
  content: true,
  isFromAdmin: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  visitorId: text("visitor_id").notNull(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  size: text("size"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export const wishlistItems = pgTable("wishlist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  visitorId: text("visitor_id").notNull(),
  productId: text("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({ id: true, createdAt: true });
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({ id: true, createdAt: true });
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
