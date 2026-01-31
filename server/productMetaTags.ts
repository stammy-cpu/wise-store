import { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { storage } from "./storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Middleware that injects dynamic Open Graph meta tags for product pages
 * This enables rich previews when sharing product links on WhatsApp, Facebook, etc.
 */
export async function productMetaTagsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Only handle product detail pages
  const productMatch = req.path.match(/^\/product\/([a-zA-Z0-9-]+)$/);
  if (!productMatch) {
    return next();
  }

  const productId = productMatch[1];

  try {
    // Fetch product data
    const product = await storage.getProduct(productId);
    if (!product) {
      return next();
    }

    // Read the base HTML file
    const htmlPath = path.resolve(__dirname, "public", "index.html");
    let html = fs.readFileSync(htmlPath, "utf-8");

    // Prepare meta tag values
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

    // Send the modified HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('[productMetaTags] Error generating meta tags:', error);
    next();
  }
}

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
