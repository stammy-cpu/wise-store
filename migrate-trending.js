import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function addTrendingColumn() {
  try {
    console.log('Adding trending column to products table...');

    await db.execute(sql`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false
    `);

    console.log('Trending column added successfully!');

    // Update any NULL values to false
    await db.execute(sql`
      UPDATE products SET trending = false WHERE trending IS NULL
    `);

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addTrendingColumn();
