import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

declare global {
  namespace Express {
    interface Request {
      rawBody?: unknown;
    }
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Import routes dynamically
const registerRoutes = async (httpServer: any, app: express.Express) => {
  try {
    const { registerRoutes: setupRoutes } = await import("../server/routes.js");
    await setupRoutes(httpServer, app);
  } catch (err) {
    console.error("Failed to load routes:", err);
    // Routes are optional for Vercel
  }
};

let initialized = false;
const distPublicPath = path.join(__dirname, "..", "dist", "public");

export default async (req: Request, res: Response) => {
  if (!initialized) {
    await registerRoutes(null, app);

    // Serve static files
    if (fs.existsSync(distPublicPath)) {
      app.use(express.static(distPublicPath));
      
      // SPA fallback
      app.use("*", (_req, res) => {
        const indexPath = path.join(distPublicPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ message: "Not Found" });
        }
      });
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    initialized = true;
  }

  app(req, res);
};
