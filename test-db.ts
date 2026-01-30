import { config } from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

// Load environment variables
config({ path: '.env.local' });

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Attempting to connect to database...');
    console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

    await client.connect();
    console.log('✅ Successfully connected to database!');

    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0]);

    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
