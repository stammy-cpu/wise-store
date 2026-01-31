-- Add trending column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false;

-- Update any existing products to have trending = false
UPDATE products SET trending = false WHERE trending IS NULL;
