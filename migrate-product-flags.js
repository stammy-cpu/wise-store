import pg from 'pg';
const { Pool } = pg;

async function migrateProductFlags() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Running database migrations...');
    console.log('📍 Database:', process.env.DATABASE_URL ? 'Connected' : 'No connection string');

    // Test connection first
    const testResult = await pool.query('SELECT 1');
    console.log('✓ Database connection successful');

    // Add best_seller column if it doesn't exist
    console.log('Adding best_seller column...');
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT false
    `);
    console.log('✓ best_seller column ready');

    // Add trending column if it doesn't exist
    console.log('Adding trending column...');
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false
    `);
    console.log('✓ trending column ready');

    // Update any NULL values to false
    console.log('Updating NULL values...');
    const updateBest = await pool.query(`
      UPDATE products
      SET best_seller = false
      WHERE best_seller IS NULL
    `);
    console.log(`✓ Updated ${updateBest.rowCount} rows for best_seller`);

    const updateTrending = await pool.query(`
      UPDATE products
      SET trending = false
      WHERE trending IS NULL
    `);
    console.log(`✓ Updated ${updateTrending.rowCount} rows for trending`);

    // Verify columns exist
    const columnsCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'products'
      AND column_name IN ('best_seller', 'trending')
    `);
    console.log(`✓ Verified ${columnsCheck.rows.length} columns exist:`, columnsCheck.rows.map(r => r.column_name));

    console.log('✅ Migration complete! Database is ready.');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    await pool.end();
    process.exit(1);
  }
}

migrateProductFlags();
