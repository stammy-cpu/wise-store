import pg from 'pg';
const { Pool } = pg;

async function migrateProductFlags() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Running database migrations...');

    // Add best_seller column if it doesn't exist
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT false
    `);
    console.log('✓ best_seller column ready');

    // Add trending column if it doesn't exist
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false
    `);
    console.log('✓ trending column ready');

    // Update any NULL values to false
    await pool.query(`
      UPDATE products
      SET best_seller = false
      WHERE best_seller IS NULL
    `);

    await pool.query(`
      UPDATE products
      SET trending = false
      WHERE trending IS NULL
    `);

    console.log('✅ Migration complete! Database is ready.');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

migrateProductFlags();
