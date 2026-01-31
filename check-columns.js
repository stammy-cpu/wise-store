import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const { Pool } = pg;

async function checkColumns() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔍 Checking products table columns...\n');

    // Get all columns from products table
    const result = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);

    console.log('Columns in products table:');
    console.log('─'.repeat(60));
    result.rows.forEach(row => {
      console.log(`${row.column_name.padEnd(25)} ${row.data_type.padEnd(20)} ${row.column_default || ''}`);
    });
    console.log('─'.repeat(60));

    // Check specifically for best_seller and trending
    const hasBestSeller = result.rows.some(row => row.column_name === 'best_seller');
    const hasTrending = result.rows.some(row => row.column_name === 'trending');

    console.log('\n📊 Status:');
    console.log(`✓ best_seller column: ${hasBestSeller ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`✓ trending column: ${hasTrending ? '✅ EXISTS' : '❌ MISSING'}`);

    // Try to query bestsellers
    if (hasBestSeller) {
      console.log('\n🔎 Checking for bestseller products...');
      const bestsellers = await pool.query('SELECT id, name, best_seller FROM products WHERE best_seller = true LIMIT 5');
      console.log(`Found ${bestsellers.rows.length} products marked as bestsellers`);
      if (bestsellers.rows.length > 0) {
        bestsellers.rows.forEach(row => {
          console.log(`  - ${row.name}`);
        });
      }
    }

    // Try to query trending
    if (hasTrending) {
      console.log('\n🔥 Checking for trending products...');
      const trending = await pool.query('SELECT id, name, trending FROM products WHERE trending = true LIMIT 5');
      console.log(`Found ${trending.rows.length} products marked as trending`);
      if (trending.rows.length > 0) {
        trending.rows.forEach(row => {
          console.log(`  - ${row.name}`);
        });
      }
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkColumns();
