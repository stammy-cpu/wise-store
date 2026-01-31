import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that updates og:image and twitter:image meta tags
 * to point to the app's opengraph image with the correct domain.
 */
export function metaImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-meta-images',
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl();
      if (!baseUrl) {
        log('[meta-images] no deployment domain configured, skipping meta tag updates');
        return html;
      }

      // Use the custom opengraph image
      const publicDir = path.resolve(process.cwd(), 'client', 'public');
      const opengraphPath = path.join(publicDir, 'opengraph-new.jpg');

      if (!fs.existsSync(opengraphPath)) {
        log('[meta-images] opengraph-new.jpg not found, skipping meta tag updates');
        return html;
      }

      const imageUrl = `${baseUrl}/opengraph-new.jpg`;

      log('[meta-images] updating meta image tags to:', imageUrl);

      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/g,
        `<meta property="og:image" content="${imageUrl}" />`
      );

      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/g,
        `<meta name="twitter:image" content="${imageUrl}" />`
      );

      return html;
    },
  };
}

function getDeploymentUrl(): string | null {
  // Check for custom site URL environment variable
  if (process.env.VITE_SITE_URL) {
    const url = process.env.VITE_SITE_URL;
    log('[meta-images] using custom site URL:', url);
    return url;
  }

  // Default to big-wise.com in production
  if (process.env.NODE_ENV === 'production') {
    const url = 'https://big-wise.com';
    log('[meta-images] using default production domain:', url);
    return url;
  }

  return null;
}

function log(...args: any[]): void {
  if (process.env.NODE_ENV === 'production') {
    console.log(...args);
  }
}
