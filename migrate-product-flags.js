import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function migrateProductFlags() {
  try {
    console.log('Adding product flag columns (best_seller, trending) to products table...');

    // Add best_seller column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT false
    `);
    console.log('✓ best_seller column added');

    // Add trending column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false
    `);
    console.log('✓ trending column added');

    // Update any NULL values to false
    await db.execute(sql`
      UPDATE products
      SET best_seller = false
      WHERE best_seller IS NULL
    `);

    await db.execute(sql`
      UPDATE products
      SET trending = false
      WHERE trending IS NULL
    `);

    console.log('✓ Migration complete! Both columns are ready.');
    console.log('\nYou can now:');
    console.log('1. Go to Admin → Products');
    console.log('2. Edit products and check "Best Seller" or "Trending"');
    console.log('3. Save and the sections will appear on the homepage\n');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProductFlags();
