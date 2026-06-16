// Simple DB verification script for Neon (CommonJS)
const { Client } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(2);
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 AS ok');
    console.log('DB verification result:', res.rows[0]);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('DB verification failed:', err.message || err);
    process.exit(3);
  }
}

main();
