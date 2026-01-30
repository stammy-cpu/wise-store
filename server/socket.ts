import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { sessionMiddleware } from "./session";
import { storage } from "./storage";

interface TypingData {
  visitorId: string;
  isTyping: boolean;
}

export function setupSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  // Use session middleware with Socket.IO
  io.engine.use(sessionMiddleware);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join a visitor room
    socket.on("join:visitor", (visitorId: string) => {
      socket.join(`visitor:${visitorId}`);
      console.log(`Socket ${socket.id} joined visitor room: ${visitorId}`);
    });

    // Admin joins all conversations
    socket.on("join:admin", () => {
      socket.join("admin");
      console.log(`Socket ${socket.id} joined admin room`);
    });

    // Handle new message from visitor
    socket.on("message:send", async (data: { visitorId: string; content: string }) => {
      try {
        const message = await storage.createMessage({
          visitorId: data.visitorId,
          content: data.content,
          isFromAdmin: false,
          userId: null,
        });

        // Send to visitor room
        io.to(`visitor:${data.visitorId}`).emit("message:new", message);

        // Notify admin
        io.to("admin").emit("message:new", message);
        io.to("admin").emit("conversation:update", data.visitorId);
      } catch (error) {
        socket.emit("message:error", { error: "Failed to send message" });
      }
    });

    // Handle new message from admin
    socket.on("message:admin", async (data: { visitorId: string; content: string; userId: string }) => {
      try {
        const message = await storage.createMessage({
          visitorId: data.visitorId,
          content: data.content,
          isFromAdmin: true,
          userId: data.userId,
        });

        // Send to visitor room
        io.to(`visitor:${data.visitorId}`).emit("message:new", message);

        // Send to admin room
        io.to("admin").emit("message:new", message);

        // Notify all admins to update conversation list
        io.to("admin").emit("conversation:update", data.visitorId);
      } catch (error) {
        socket.emit("message:error", { error: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing:start", (data: TypingData) => {
      io.to(`visitor:${data.visitorId}`).emit("typing:update", {
        visitorId: data.visitorId,
        isTyping: true,
        isAdmin: false,
      });
      io.to("admin").emit("typing:update", {
        visitorId: data.visitorId,
        isTyping: true,
        isAdmin: false,
      });
    });

    socket.on("typing:stop", (data: TypingData) => {
      io.to(`visitor:${data.visitorId}`).emit("typing:update", {
        visitorId: data.visitorId,
        isTyping: false,
        isAdmin: false,
      });
      io.to("admin").emit("typing:update", {
        visitorId: data.visitorId,
        isTyping: false,
        isAdmin: false,
      });
    });

    socket.on("typing:admin", (data: { visitorId: string; isTyping: boolean }) => {
      // Notify the visitor that admin is typing
      io.to(`visitor:${data.visitorId}`).emit("typing:update", {
        visitorId: data.visitorId,
        isTyping: data.isTyping,
        isAdmin: true,
      });
      // Notify other admins that this admin is typing
      socket.to("admin").emit("typing:update", {
        visitorId: data.visitorId,
        isTyping: data.isTyping,
        isAdmin: true,
      });
    });

    // Handle mark as read
    socket.on("messages:read", async (visitorId: string) => {
      try {
        await storage.markMessagesAsRead(visitorId);
        io.to("admin").emit("messages:read", visitorId);
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
