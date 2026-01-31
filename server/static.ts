import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { productMetaTagsMiddleware } from "./productMetaTags";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Inject dynamic meta tags for product pages (before catch-all)
  app.use(productMetaTagsMiddleware);

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
