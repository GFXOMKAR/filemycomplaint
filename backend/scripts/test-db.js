/**
 * Run: node scripts/test-db.js
 * Tests MongoDB connection without starting the full server.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const buildMongoUri = require('../config/mongodbUri');

let uri;

try {
  uri = buildMongoUri();
} catch (error) {
  console.error('FAIL:', error.message);
  process.exit(1);
}

console.log('--- MongoDB connection test ---\n');
console.log('Connection config found:', true);

console.log('Uses mongodb+srv:', uri.startsWith('mongodb+srv://'));
console.log('Has database name:', /\.net\/[^/?]+/.test(uri));
console.log('Has placeholders:', /<(password|username|cluster)>/.test(uri));

if (uri.includes('<password>')) {
  console.error('\nFAIL: Replace <password> in .env with your real Atlas password.');
  process.exit(1);
}

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 20000 })
  .then((conn) => {
    console.log('\nSUCCESS: Connected to', conn.connection.host);
    console.log('Database:', conn.connection.name);
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nFAIL:', err.message);
    console.error('\nCommon fixes:');
    console.error('  1. Atlas → Network Access → Add IP Address (or 0.0.0.0/0 for dev)');
    console.error('  2. Atlas → Database Access → Edit user → Reset password');
    console.error('  3. Put URI in quotes in .env if it contains &');
    console.error('  4. URL-encode password: @ → %40, # → %23, / → %2F');
    process.exit(1);
  });
