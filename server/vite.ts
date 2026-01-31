import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { storage } from "./storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip API routes - let them be handled by the API handlers
    if (url.startsWith("/api")) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // Inject dynamic meta tags for product pages
      const productMatch = req.path.match(/^\/product\/([a-zA-Z0-9-]+)$/);
      if (productMatch) {
        const productId = productMatch[1];
        try {
          const product = await storage.getProduct(productId);
          if (product) {
            template = injectProductMetaTags(template, product, req);
          }
        } catch (error) {
          console.error('[vite] Error injecting product meta tags:', error);
        }
      }

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * Inject product-specific meta tags into HTML template
 */
function injectProductMetaTags(html: string, product: any, req: any): string {
  const siteName = "Bigwise Clothings";
  const productTitle = product.name;
  const productDescription = product.description || "Check out this item from Bigwise Clothings";
  const productImage = product.images[0] || "/opengraph-new.jpg";
  const productPrice = `₦${product.price}`;
  const productSizes = product.sizes.join(", ");

  // Construct the full description with price and sizes
  const fullDescription = `${productDescription}\n\nPrice: ${productPrice}\nSizes: ${productSizes}`;

  // Get the base URL (for absolute image URLs)
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;

  // Make sure image URL is absolute
  const absoluteImageUrl = productImage.startsWith('http')
    ? productImage
    : `${baseUrl}${productImage}`;

  // Helper function to escape HTML
  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  };

  // Replace meta tags with product-specific values
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(productTitle)}" />`
  );

  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(fullDescription)}" />`
  );

  html = html.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${absoluteImageUrl}" />`
  );

  html = html.replace(
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="product" />`
  );

  // Add product-specific OG tags
  const productMetaTags = `
    <meta property="og:url" content="${baseUrl}${req.path}" />
    <meta property="product:price:amount" content="${product.price}" />
    <meta property="product:price:currency" content="NGN" />`;

  html = html.replace(
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="product" />${productMetaTags}`
  );

  // Update Twitter Card meta tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(productTitle)}" />`
  );

  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(fullDescription)}" />`
  );

  html = html.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${absoluteImageUrl}" />`
  );

  // Update page title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(productTitle)} - ${siteName}</title>`
  );

  return html;
}
